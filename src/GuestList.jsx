import React, { useState } from 'react';

export default function GuestList() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guests, setGuests] = useState([]);

  // Function to add a guest to the list
  function addGuest() {
    if (firstName && lastName) {
      const newGuest = {
        id: guests.length + 1, // ID is based on the current length of the array
        name: `${firstName} ${lastName}`,
      };

      // console.log(`Guest ID: ${newGuest.id}`); // Check the guest id

      setGuests([...guests, newGuest]); // Add the new guest to the list
      setFirstName(''); // Clear first name input
      setLastName(''); // Clear last name input
    }
  }

  // Function to remove a guest from the list
  function removeGuest(id) {
    const updatedGuestList = guests.filter((guest) => guest.id !== id);
    setGuests(updatedGuestList);
  }

  return (
    <div data-test-id="guest">
      <h1>Guest List</h1>
      <form>
        <label>
          First name
          <input
            className="first-name"
            placeholder="John"
            value={firstName}
            onChange={(event) => setFirstName(event.currentTarget.value)}
          />
        </label>
        <label>
          Last name
          <input
            className="last-name"
            placeholder="Doe"
            value={lastName}
            onChange={(event) => setLastName(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                addGuest(); // Call addGuest function on Enter
              }
            }}
          />
        </label>
      </form>

      {/* Display the list of guests */}
      <ul>
        {guests.map((guest) => (
          <li key={`guest-${guest.id}`}>
            {guest.name}
            <button
              className="remove-button"
              onClick={() => removeGuest(guest.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
