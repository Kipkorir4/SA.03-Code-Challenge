const filmsList = document.getElementById('films'); // Reference to the list where films will be displayed
const posterPic = document.getElementById('poster'); // Reference to the poster image element
const movieTitle = document.getElementById('title'); // Reference to the movie title element
const movieDuration = document.getElementById('runtime'); // Reference to the movie duration element
const movieInfo = document.getElementById('film-info'); // Reference to the movie information element
const timeAired = document.getElementById('showtime'); // Reference to the showtime element
const remTickets = document.getElementById('ticket-num'); // Reference to the remaining tickets element
const ticketBtn = document.getElementById('buy-ticket'); // Reference to the buy ticket button element

let fetchUrl = 'https://movies-w161.onrender.com/films'; // URL to fetch films data from

// Function to fetch and display films
function getItems() {
    fetch(fetchUrl)
        .then((res) => res.json())
        .then((data) => {
            // Loop through each movie data
            data.forEach((movie) => {
                // Create a list item for each movie
                const li = document.createElement('li');
                li.innerHTML = `
                    ${movie.title.toUpperCase()} <br>
                    <button id='D${movie.id}'>DELETE</button> <hr>
                `;

                // Set ID for the list item
                li.id = `F${movie.id}`;

                // Append list item to films list
                filmsList.appendChild(li);
                // document.getElementById(`F${movie.id}`).style.cssText = `
                               
                // `
                document.getElementById(`D${movie.id}`).style.cssText = `
                display: block;
                margin: auto;
                margin-top : 7px;
                border-style : solid;
                border-width : 0px;
                color : white;
                padding-left : 12px;
                padding-right : 12px;
                padding-top : 6px;
                padding-bottom : 6px;
                border-radius : 15px
                
                `
                // document.getElementById(`D${movie.id}`).style.paddingLeft = '10px'
                // document.getElementById(`D${movie.id}`).style.borderRadius = '10px'

                // Disable delete button and mark as sold out if tickets are sold out
                if ((movie.capacity - movie.tickets_sold) == 0) {
                    li.classList.add('sold-out');
                    document.getElementById(`D${movie.id}`).classList.add('sold-out');
                    document.getElementById(`D${movie.id}`).disabled = true;
                }else if((movie.capacity - movie.tickets_sold) != 0){document.getElementById(`D${movie.id}`).style.backgroundColor = '#E30B5C'}

                // Display movie information when clicked
                allInfoDisplay(movie);

                // Remove movie when delete button is clicked
                removeItem(movie);
            });

            // Display initial movie information
            initLoad(data[0]);
        });
}

// Function to display all movie information when a movie is clicked
function allInfoDisplay(movieItem) {
    let titleLine = document.getElementById(`F${movieItem.id}`);
    titleLine.addEventListener('click', () => {
        remTickets.textContent = `${movieItem.capacity - movieItem.tickets_sold}`;
        posterPic.src = movieItem.poster;
        movieTitle.textContent = movieItem.title;
        movieDuration.textContent = movieItem.runtime;
        timeAired.textContent = movieItem.showtime;
        movieInfo.textContent = movieItem.description;

        // Update button text and functionality
        if (remTickets.textContent == 0) {
            ticketBtn.textContent = 'Sold out!';
        } else {
            ticketBtn.textContent = 'Buy Ticket';
        }
        buyTicket(movieItem);
    });
}

// Function to display initial movie information
function initLoad(movieItem) {
    remTickets.textContent = `${movieItem.capacity - movieItem.tickets_sold}`;
    posterPic.src = movieItem.poster;
    movieTitle.textContent = movieItem.title;
    movieDuration.textContent = movieItem.runtime;
    timeAired.textContent = movieItem.showtime;
    movieInfo.textContent = movieItem.description;

    // Update button text and functionality
    if (remTickets.textContent == 0) {
        ticketBtn.textContent = 'Sold out!';
    } else {
        ticketBtn.textContent = 'Buy Ticket';
    }
    buyTicket(movieItem);
}

// Function to handle buying tickets
function buyTicket(movie) {
    ticketBtn.onclick = () => {
        if (remTickets.textContent > 0) {
            // Update remaining tickets and tickets sold
            remTickets.textContent--;
            movie.tickets_sold++;
            // Patch movie data
            fetch(`${fetchUrl}/${movie.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    tickets_sold: movie.tickets_sold
                })
            })
                .then((res) => res.json())
                .then(data => {
                    remTickets.textContent = `${data.capacity - data.tickets_sold}`;
                    if (remTickets.textContent == 0) {
                        document.getElementById(`D${movie.id}`).classList.add('sold-out');
                        document.getElementById(`D${movie.id}`).disabled = true;
                        ticketBtn.textContent = 'Sold out!';
                        document.getElementById(`F${movie.id}`).classList.add('sold-out');
                    }
                });

            // Post ticket purchase
            fetch('https://movies-w161.onrender.com/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    film_id: movie.id,
                    number_of_tickets: 1
                })
            })
                .catch((err) => alert(err.message));

        }
    };
}

// Function to remove a movie
function removeItem(movie) {
    const deleteBtn = document.getElementById(`D${movie.id}`);
    deleteBtn.addEventListener('click', () => {
        // Delete movie data
        fetch(`${fetchUrl}/${movie.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

    });
}

// Call the getItems function to fetch and display movies
getItems();