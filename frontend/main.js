window.onload = function () {
    let page = 1;
    let rootURL = 'https://todo-simple-api.herokuapp.com/';
    let hasMore = true;
    let postToDoURL = rootURL + 'todos';

    //deklaracja funkcji fetchToDos zajmującej sie pobieraniem todosów z API
    function fetchToDos( page ) {
        if( !hasMore ) {
            return
        }
        let list = document.getElementById( 'todo' );
        let loader = document.createElement( 'li' );
        loader.innerHTML = 'Loading more todos.....';
        list.appendChild( loader );

        let getToDosURL = rootURL + `todos?page=${page}&page_size=20`;
        fetch( getToDosURL ).then( response => { return response.json();} )
            .then( response => {
                list.removeChild( loader );
                //sprawdzam czy jest więcej do pobrania
                if( response.data.length < 20 ) {
                    hasMore = false;
                }
                response.data.map( todo => {

                        return addItemToDo( todo );
                    }
                )
            } );

    }

    //wywołanie funkcji aby na wejście pobrać pierwsze todosy
    fetchToDos( page );

    // deklaracja funkcji postToDo zajmującej się dodawaniem nowego todo do api
    function postToDo( value ) {
        const data = {
            "title": value,
            "description": "new todo",
            "isComplete": false,
        };
        return fetch( postToDoURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify( data ),
        } ).then( response => response.json() );
    }

    //deklaracja funkcji updateToDo która zmienie status na zrobione lub nie w oparciu o parametr bool
    function updateToDo( id, bool ) {
        const data = {
            "description": "udating todo",
            "isComplete": bool
        };
        return fetch( `${postToDoURL}` + '/' + `${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify( data ),

        } ).then( response => response.json() );
    }

    //funkcja usuwa todo w api
    function deleteToDo( id ) {

        return fetch( `${postToDoURL}` + '/' + `${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            }
        } ).then( response => response.json() );
    }

    // dodaje eventListnera na click dla dodawanie nowego todosa
    document.getElementById( 'plus' ).addEventListener( 'click', function () {
        let value = document.getElementById( 'item' ).value;
        if( value ) {
            postToDo( value ).then( response => addItemToDo( response.data ) );
            document.getElementById( 'item' ).value = '';
        }
    } );

    //addItemToDo zajmuje się generowaniem html na podstawie obiektu który retodo
    function addItemToDo( todo ) {
        let bool = todo.isComplete;
        let list = document.getElementById( 'todo' );
        let item = document.createElement( 'li' );
        item.setAttribute( 'id', todo.id );
        let checkbox = document.createElement( 'div' );
        checkbox.classList.add( 'checkbox' );
        let label = document.createElement( 'label' );
        let check = document.createElement( 'input' );
        check.setAttribute( 'type', 'checkbox' );
        check.checked = bool;
        let span = document.createElement( 'span' );
        let content = document.createElement( 'div' );
        content.classList.add( 'content' );
        content.classList.add( bool ? 'contentChecked' : 'contentUnchecked' );
        content.innerText = todo.title;
        let buttonTrash = document.createElement( 'div' );
        buttonTrash.classList.add( 'buttonTrash' );
        let trashCan = document.createElement( 'button' );
        trashCan.classList.add( 'trash' );
        trashCan.style.backgroundImage = bool ? "url('../assets/img/to-do-list---Kopia_07_buttontrash_checked.gif')" : "url('../assets/trash.png')";
        label.appendChild( check );
        label.appendChild( span );
        checkbox.appendChild( label );
        buttonTrash.appendChild( trashCan );
        item.appendChild( checkbox );
        item.appendChild( content );
        item.appendChild( buttonTrash );
        list.appendChild( item );


    }

    // dodaje eventListnera na click dla zmiany statusu todusa z nie  zrobionego na zrobiony lub odwrotnie oraz gdy warunek jest spełniony event listner odpala fuckcję deleteToDo która usuwa todosa
    document.getElementById( "todo" ).addEventListener( 'click', function ( event ) {

        let li = event.target.closest( 'LI' );
        if( !li ) {
            return
        }
        if( event.target.className === 'buttonTrash' || event.target.className === 'trash' ) {

            document.getElementById( "todo" ).removeChild( li );
            return deleteToDo( li.id );
        }
        checkingItem( li.id );
    } );
    // dodaje eventListnera na scroll żeby sprawdzić czy jestem na dole listy, a jeżeli tak ładuję kolejną porcję todosów z api
    document.getElementById( "todo" ).addEventListener( 'scroll', function ( event ) {
        let element = event.target;
        if( element.scrollHeight - element.scrollTop === element.clientHeight ) {
            //jeśli warunek spełniony podbijam nr page i wykonuję nowe pobranie danych z nową wartościę parametru
            page++;
            fetchToDos( page );
        }
    } );

    //deklaracja funkcji checkingItem która po wywołaniu odpowiada za obsługę zmiany statusu todosa
    function checkingItem( id ) {
        let todo = document.getElementById( id );
        let check = todo.getElementsByTagName( 'input' )[0];
        let trashCan = todo.getElementsByTagName( 'button' )[0];
        let text = todo.querySelector( '.content' );
        if( !check.checked && text ) {
            check.checked = true;
            trashCan.style.backgroundImage = "url('../assets/img/to-do-list---Kopia_07_buttontrash_checked.gif')";
            text.classList.toggle( "contentChecked" );
            updateToDo( id, true );
        } else {
            check.checked = false;
            trashCan.style.backgroundImage = "url('../assets/trash.png')";
            updateToDo( id, false );
            text.classList.toggle( "contentChecked" );
        }

    }

};



