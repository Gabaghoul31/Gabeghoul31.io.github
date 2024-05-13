const groceryList = document.getElementById('groceryItems');
const otherList = document.getElementById('otherItems');
const addGroceryBtn = document.getElementById('addGrocery');
const addOtherBtn = document.getElementById('addOther');
const newGroceryInput = document.getElementById('newItemGrocery');
const newOtherInput = document.getElementById('newItemOther');

function createListItem(text, list) {
    const listItem = document.createElement('li');
    const textNode = document.createTextNode(text);
    listItem.appendChild(textNode);

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
        list.removeChild(listItem);
        saveLists();
    });

    listItem.appendChild(removeBtn);
    return listItem;
}

function loadLists() {
    console.log("Attempting to load lists...");
    fetch('https://morning-woodland-96579-141743ef28e3.herokuapp.com/load-data')
    .then(response => {
        if (!response.ok) throw new Error('Failed to load data');
        return response.json(); // Automatically parses JSON
    })
    .then(data => {
        console.log("Loaded data:", data);
        groceryList.innerHTML = '';
        otherList.innerHTML = '';

        data.groceryList.forEach(item => {
            groceryList.appendChild(createListItem(item, groceryList));
        });
        data.otherList.forEach(item => {
            otherList.appendChild(createListItem(item, otherList));
        });
    })
    .catch(error => {
        console.error('Error loading data:', error);
    });
}

function saveLists() {
    const groceryItems = Array.from(groceryList.children).map(item => item.firstChild.textContent);
    const otherItems = Array.from(otherList.children).map(item => item.firstChild.textContent);
    const data = { groceryList: groceryItems, otherList: otherItems };

    fetch('https://morning-woodland-96579-141743ef28e3.herokuapp.com/update-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Directly pass data
    })
    .then(response => response.json())
    .then(result => console.log('Save result:', result))
    .catch(error => console.error('Error on save:', error));
}

addGroceryBtn.addEventListener('click', () => {
    const newItem = newGroceryInput.value;
    if (newItem) {
        groceryList.appendChild(createListItem(newItem, groceryList));
        newGroceryInput.value = '';
        saveLists();
    }
});

addOtherBtn.addEventListener('click', () => {
    const newItem = newOtherInput.value;
    if (newItem) {
        otherList.appendChild(createListItem(newItem, otherList));
        newOtherInput.value = '';
        saveLists();
    }
});

loadLists();

// Calendar Functionality
const calendarDiv = document.getElementById('calendar');
const currentDate = new Date();

function renderCalendar(year = currentDate.getFullYear(), month = currentDate.getMonth()) {
    const firstDay = (new Date(year, month)).getDay();
    const daysInMonth = 32 - new Date(year, month, 32).getDate();

    let calendarHTML = `
        <table>
            <thead>
                <tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>
            </thead>
            <tbody>
    `;

    let dayCounter = 1;
    for (let i = 0; i < 6; i++) { // Max 6 weeks in a month
        calendarHTML += '<tr>';
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                calendarHTML += '<td></td>';
            } else if (dayCounter > daysInMonth) {
                break;
            } else {
                calendarHTML += `<td ${dayCounter === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear() ? 'class="today"' : ''}>${dayCounter}</td>`;
                dayCounter++;
            }
        }
        calendarHTML += '</tr>';
    }

    calendarHTML += `
            </tbody>
        </table>
    `;

    calendarDiv.innerHTML = calendarHTML;
}

// Initial Calendar Render
renderCalendar(); 
