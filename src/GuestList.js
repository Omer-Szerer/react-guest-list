import React, { useEffect, useState } from 'react';

export default function GuestList() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true); // Start with true for initial load
  const baseUrl = 'https://3t8c3r-4000.csb.app/guests';

  // Fetch guests from the API when the component loads
  useEffect(() => {
    async function fetchGuests() {
      setLoading(true); // Set loading to true before starting the fetch
      console.log('Fetching guests, loading set to true'); // Debugging statement

      try {
        const response = await fetch(baseUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch guests');
        }
        const data = await response.json();
        setGuests(data);
      } catch (error) {
        console.error('Error fetching guests:', error);
      } finally {
        setLoading(false); // Ensure loading is false after fetch completes
        console.log('Fetch completed, loading set to false'); // Debugging statement
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
        const response = await fetch(baseUrl, {
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
      const response = await fetch(`${baseUrl}/${id}`, {
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
      const response = await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Failed to delete guest');
      }

      setGuests(guests.filter((guest) => guest.id !== id));
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  }

  return (
    <div className="main-container">
      <h1>Join the list</h1>
      <div className="input-container">
        <form onSubmit={(event) => event.preventDefault()} disabled={loading}>
          <div className="input-group">
            <label>
              First name
              <input
                className="first-name"
                placeholder="Add first name"
                value={firstName}
                onChange={(event) => setFirstName(event.currentTarget.value)}
                disabled={loading} // Inputs disabled while loading
              />
            </label>
            <div className="name-validation-container">
              <span className="name-validation">{firstName ? '✅' : '✔️'}</span>
            </div>
          </div>
          <div className="input-group">
            <label>
              Last name
              <input
                className="last-name"
                placeholder="Add last name"
                value={lastName}
                onChange={(event) => setLastName(event.currentTarget.value)}
                disabled={loading} // Inputs disabled while loading
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addGuest().catch((error) => {
                      console.error('Error adding guest:', error);
                    });
                  }
                }}
              />
            </label>
            <div className="name-validation-container">
              <span className="name-validation">{lastName ? '✅' : '✔️'}</span>
            </div>
          </div>
        </form>
      </div>
      <h2>Guest List</h2>
      {loading ? (
        <>
          <p>Loading...</p>
          {console.log('Rendering Loading...')}
        </>
      ) : (
        <div>
          <ul>
            {guests.map((guest) => (
              <li
                key={`guest-${guest.id}`}
                className={`guest-card ${guest.attending ? 'attending' : 'not-attending'}`}
              >
                <div data-test-id="guest" className="guest-info">
                  <input
                    type="checkbox"
                    aria-label="attending status"
                    checked={guest.attending}
                    onChange={() => toggleAttendance(guest.id)}
                    className="guest-checkbox"
                  />
                  <span className="guest-name">
                    {guest.firstName} {guest.lastName}
                  </span>
                </div>
                <button
                  aria-label={`Remove ${guest.firstName} ${guest.lastName}`}
                  className="remove-button"
                  onClick={() => removeGuest(guest.id)}
                >
                  {/* ❌ */}
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
