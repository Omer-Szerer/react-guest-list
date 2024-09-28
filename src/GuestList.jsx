import React, { useEffect, useState } from 'react';

export default function GuestList() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state

  // Fetch guests from the API when the component loads
  useEffect(() => {
    async function fetchGuests() {
      try {
        const response = await fetch('http://localhost:4000/guests');
        if (!response.ok) {
          throw new Error('Failed to fetch guests');
        }
        const data = await response.json();
        setGuests(data);
      } catch (error) {
        console.error('Error fetching guests:', error);
      } finally {
        setLoading(false); // Set loading to false after fetch is done
      }
    }

    fetchGuests().catch((error) => {
      console.log(error);
      setLoading(false); // Ensure loading is stopped even if there's an error
    });
  }, []);

  // Add a guest to the API
  async function addGuest() {
    if (firstName && lastName) {
      try {
        const response = await fetch('http://localhost:4000/guests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName,
            lastName,
            attending: false, // Default status
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to add guest');
        }

        const newGuest = await response.json();
        setGuests([...guests, newGuest]); // Add new guest to state
        setFirstName(''); // Clear input fields
        setLastName('');
      } catch (error) {
        console.error('Error adding guest:', error);
      }
    }
  }

  // Toggle attendance status
  async function toggleAttendance(id) {
    try {
      const guest = guests.find((g) => g.id === id);
      const response = await fetch(`http://localhost:4000/guests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attending: !guest.attending }),
      });

      if (!response.ok) {
        throw new Error('Failed to update attendance status');
      }

      const updatedGuest = await response.json();
      setGuests(
        guests.map((g) =>
          g.id === id ? { ...guest, attending: updatedGuest.attending } : g,
        ),
      );
    } catch (error) {
      console.error('Error updating attendance status:', error);
    }
  }

  // Remove a guest
  async function removeGuest(id) {
    try {
      const response = await fetch(`http://localhost:4000/guests/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete guest');
      }

      setGuests(guests.filter((guest) => guest.id !== id));
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  }

  return (
    <div data-test-id="guest">
      <h1>Guest List</h1>
      <form onSubmit={(event) => event.preventDefault()}>
        <label>
          First name
          <input
            className="first-name"
            placeholder="John"
            value={firstName}
            onChange={(event) => setFirstName(event.currentTarget.value)}
            disabled={loading} // Disable input while loading
          />
        </label>
        <label>
          Last name
          <input
            className="last-name"
            placeholder="Doe"
            value={lastName}
            onChange={(event) => setLastName(event.currentTarget.value)}
            disabled={loading} // Disable input while loading
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                addGuest();
              }
            }}
          />
        </label>
      </form>

      {/* Display loading message while fetching data */}
      {loading ? (
        <p>Loading guests...</p>
      ) : (
        <ul>
          {guests.map((guest) => (
            <li key={`guest-${guest.id}`}>
              {guest.firstName} {guest.lastName}
              <button
                className="remove-button"
                onClick={() => removeGuest(guest.id)}
              >
                Remove
              </button>
              <input
                type="checkbox"
                aria-label="attending status"
                checked={guest.attending}
                onChange={() => toggleAttendance(guest.id)}
              />
              <span>
                {guest.attending
                  ? `${guest.firstName} ${guest.lastName} is attending`
                  : `${guest.firstName} ${guest.lastName} is not attending`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
