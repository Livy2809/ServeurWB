document.addEventListener('DOMContentLoaded', function () {
    const addTaskForm = document.getElementById('add-task-form');
    const taskList = document.getElementById('task-list');

    // Liste des Tâches : Afficher les tâches à accomplir.
    function fetchTasks() {
        fetch('/tasks')
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = ''; // Efface la liste existante
                tasks.forEach(task => {
                    const taskItem = document.createElement('li');
                    taskItem.innerHTML = `
                        <span>${task.title}</span>
                        <button class="delete-task" data-task-id="${task.id}">Supprimer</button>
                    `;
                    taskList.appendChild(taskItem);
                });
            })
            .catch(error => console.error('Erreur lors de la récupération des tâches:', error));
    }

    fetchTasks(); // Charge les tâches au chargement de la page

    // Ajout de Tâches : Formulaire pour ajouter de nouvelles tâches.
    addTaskForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const taskInput = document.getElementById('task');
        const newTask = taskInput.value;

        fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: newTask, completed: false }),
        })
            .then(response => response.json())
            .then(data => {
                fetchTasks(); // Rafraîchit la liste après l'ajout d'une tâche
            })
            .catch(error => console.error('Erreur lors de l\'ajout de la tâche:', error));

        // Réinitialiser le champ de saisie
        taskInput.value = '';
    });

    // Suppression et Marquage : Actions pour supprimer ou marquer les tâches comme terminées.
    taskList.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-task')) {
            const taskItem = event.target.closest('li');
            const taskId = event.target.getAttribute('data-task-id');

            // Utilisez fetch ou une bibliothèque comme axios pour interagir avec votre backend
            fetch(`/tasks/${taskId}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => {
                    fetchTasks(); // Rafraîchit la liste après la suppression d'une tâche
                })
                .catch(error => console.error('Erreur lors de la suppression de la tâche:', error));
        }
    });
});
