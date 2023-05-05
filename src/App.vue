<template>
  <div class="wrapper-todo">
    <div class="title has-text-centered">My ToDo List!</div>

    <form @submit.prevent="addTodo">
      <!-- @submit.prevent ??????-->
      <div class="field is-grouped mb-5">
        <p class="control is-expanded">
          <input
            v-model="newtodoContent"
            class="input"
            type="text"
            placeholder="Add a todo"
          />
          <!-- v-model="newtodoContent" мы связали наше поле ввода с хранилищем из ref-->
        </p>
        <p class="control">
          <button :disabled="!newtodoContent" class="button is-info">
            Add
          </button>
          <!-- :disabled(блокировщик)="!newtodoContent" мы указали, что если поле input будет пустым, то кнопка будет заблокирована-->
        </p>
      </div>
    </form>

    <div
      class="card mb-5"
      v-for="todo in todos"
      :key="todo.id"
      :class="{ 'has-background-success-light': todo.done }"
    >
      <!-- мы пробрасываем через v-for наши дубляжи карточек, если прописать v-for="hehehe in 100" :key="hehehe", то тоже все будет работать -->
      <!-- todo вспомогательный объект, todos наш основной объект созданный в script, чтобы мы брали информацию не в html, а из сервера-->
      <!-- key наш уникальный идетификатор, его можно не указывать, но html будет подсвечивать ошибку, а браузер нет-->
      <!-- :class меняем нашу стилистику, : todo.done указали, что как только статус будет выполнен сработают стили -->
      <div class="card-content">
        <div class="content">
          <div class="columns is-vcentered">
            <div
              class="column"
              :class="{ 'has-text-success line-through': todo.done }"
            >
              {{ todo.content }}
            </div>
            <!-- {{todo.content}} мы вывели наш вспомогательный объект наполненный content, прописанный в карточках ref-->
            <!-- :class мы прописали применение класса, когда будет true -->
            <div class="column is-6 has-text-rigth">
              <button
                class="button is-ligth"
                :class="todo.done ? 'is-success' : 'is-light'"
                @click="toggleDone(todo.id)"
              >
                &check;
              </button>
              <!-- :class мы прописали наше условаие, что если todo.done будет true, то примениться класс is-success, а если false, то is-light -->
              <button
                @click="deleteTodo(todo.id)"
                class="button is-danger ml-2"
              >
                &cross;
              </button>
              <!-- @click="deleteTodo(todo.id)" мы назвали наш метод и указали, что по клику ты будешь находишь id этого объекта -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// setup() мы говорим нашему коду, что мы разрабатываем с помощью composition API, можно прописать в export default, вместо data(), как мы ранее писали
// setup - наш синтаксический сахар(чтобы выглядело все локанично), лучщий синтаксис при работе с однофайловыми компонентами, в нашем случае тоько App.vue
import { ref, onMounted } from "vue";
// ref локальное хранение данных в компоненте, он принимает внутреннее значение и возвращает реактивный и изменяемый объект ref, указывается через .value
// onMounted ???
import { db } from "@/firebase";
/** ипортировали db подключенный в папке firebase, @ быстрый способ попасть к папке, чтобы не прописывать весь путь */
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
// onSnapshot метод чтобы мы получали данные из FB
// addDoc для добавления данных в FB
// doc, deleteDoc методы для удаления из FB
// updateDoc если мы хотим обновить некоторые поля документа,без перезаписи всего документа; в нашем случае, чтобы done менялся с false на true и наоборот
// query, orderBy, limit(если нам нужны лимиты тогда нужно импортировать тоже) чтобы у нас работала сортировка по дате
// ранее было указано getDocs, где мы комментировали это мы зачем импортировали??

// import { v4 as uuidv4 } from "uuid";
// мы импортировали наш uuid в наш файлик, после того, как мы подключили FB, uuid нам больше не нужен

const todos = ref([
  // {
  //   id: "id1",
  //   content: "hello boys!",
  //   done: false,
  // },
  // {
  //   id: "id2",
  //   content: "hello girls!",
  //   done: true,
  // },
]);

/**
 * Firebase ref
 */
const todosCollectionRef = collection(db, "todos");
// мы завели нашу переменную, чтобы не писать постоянно doc collection
const todosCollectionQuery = query(todosCollectionRef, orderBy("date", "desc"));
// завели переменную для сортировки даты из документации FB, первый аргумент наша основная переменна, date мы указали что нам нужно сортировать
// limit(2) будет нам отображать последние 2 заведенные заметки


/** Получение наших get todos */

// из документации мы закинули функционал для получения данных в реальном времени из FB
// onSnapshot слушатель документа, он будет получать каждый раз наш снимок результатов, как только там что-то будет меняться
onMounted(() => {
  onSnapshot(todosCollectionQuery, (querySnapshot) => {
    const fbTodos = [];
    querySnapshot.forEach((doc) => {
      const todo = {
        id: doc.id,
        content: doc.data().content,
        done: doc.data().done,
      };
      fbTodos.push(todo);
    });
    todos.value = fbTodos;
  });
});

//начинаются наши методы add todo

const newtodoContent = ref(""); // создали пустое хранилище, если что-то введем в "", то это отобразится в нашем input

const addTodo = () => {
  addDoc(todosCollectionRef, {
    content: newtodoContent.value,
    // мы прописали как из FB, что из нашего массива будет считываться значение контента
    done: false,
    date: Date.now(),
    // мы устанавливаем время текущей даты, в FB мы увидим добавление уникального ключа date
    // query метод для упорядочивания наших заметок по дате
  });
  newtodoContent.value = "";
  // мы указали, чтобы по умолчанию наше поле ввода было пустым

  // ранее способ без подключенного FB
  // сюда мы прописали наш метод указанный в form, при вводе какого-то текста в наше окошко(Add a todo), будет отрабатывать
  // const newTodo = {
  //   id: uuidv4(), // ???????????
  //   content: newtodoContent.value,
  //   // так как ref принимает значение через value, то для отображения мы добавляем наше пустое хранилище и прописываем value
  //   done: false,
  // };
  // todos.value.unshift(newTodo);
  // мы указали, возьми наш массив (todos), добавь ему значение (value), добавь метод unshift (добавляет один или более элементов в начало массива и возвращает новую длину массива),
  // и в скобках мы указали наш объект в каком формате нам нужна наша запись
};

// Удаление наших заметок delete todo
const deleteTodo = (id) => {
  deleteDoc(doc(todosCollectionRef, id));
  // строчка из документашки первый аргумент наша коллекция данных, второй аргумент что именно нам там найти id
  // ранее было написано без подключения к FB, todos.value = todos.value.filter((todo) => todo.id !== id);
  // берем наш реактивный массив, получаем наши данные с помощью value, todos.value.filter указали что мы хотим с этим сделать,
  // (todo) получаем каждый элемент todo, с помощью функции мы указали, что ждём его id, далее !==id сверяем что мы удалили, а что нет
};

// Добавляем выполнение заметки toddle done
const toggleDone = (id) => {
  const index = todos.value.findIndex((todo) => todo.id === id);
  // мы завели переменную, далее = мы указали что в нашем хранилище найти заметку, ее значение и найти именно индекс,
  // (todo) получаем каждый элемент todo, с помощью функции мы указали, что ждём его id, далее что он должен быть равено нашему id

  // ранее писали без привязки к FB - todos.value[index].done = !todos.value[index].done;
  // создали наш toggle, когда true и когда !(false) мы указали, что у нас есть массив todos и нам нужно его значение value,
  // указали что у него есть index и метод done, который прописывали в ref

  updateDoc(doc(todosCollectionRef, id), {
    done: !todos.value[index].done,
  });
  // взяли из документации срочку, заменили константу, чтобы не множить их, подставили наш 1 аргумент и id, в done мы прописали как раз таки наш тоглер
  // что когда у нас по умолчанию false, при нажатии на галочку у нас в FB подтягивалось значение true
  // метод mark done наша двухсторонняя связка кнопки с FB
};
</script>


<style>
@import "node_modules\bulma\css\bulma.min.css";
/* сначала через терминал мы инициализировали bulma, а потом мы ипортировали нашу его в наш файлик */

.wrapper-todo {
  max-width: 400px;
  padding: 20px;
  margin: 0 auto;
}

.line-through {
  text-decoration: line-through;
}

@media (min-width: 1024px) {
  #app {
    display: block !important;
  }
}
</style>