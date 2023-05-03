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

    <div class="card mb-5" v-for="todo in todos" :key="todo.id">
      <!-- мы пробрасываем через v-for наши дубляжи карточек, если прописать v-for="hehehe in 100" :key="hehehe", то тоже все будет работать -->
      <!-- todo вспомогательный объект, todos наш основной объект созданный в script, чтобы мы брали информацию не в html, а из сервера-->
      <!-- key наш уникальный идетификатор, его можно не указывать, но html будет подсвечивать ошибку, а браузер нет-->
      <div class="card-content">
        <div class="content">
          <div class="columns is-vcentered">
            <div class="column">{{ todo.content }}</div>
            <!-- {{todo.content}} мы вывели наш вспомогательный объект наполненный content, прописанный в карточках ref-->
            <div class="column is-5 has-text-rigth">
              <button class="button is-ligth">&check;</button>
              <button class="button is-danger ml-2">&cross;</button>
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
import { ref } from "vue";
// ref локальное хранение данных в компоненте, он принимает внутреннее значение и возвращает реактивный и изменяемый объект ref, указывается через .value
import { v4 as uuidv4 } from "uuid"; 
// мы импортировали наш uuidv в наш файлик

const todos = ref([
  // {
  //   id: "id1",
  //   content: "hello boys!",
  //   done: false,
  // },
  // {
  //   id: "id2",
  //   content: "hello girls!",
  //   done: false,
  // },
]);

//начинаются наши методы add todo

const newtodoContent = ref(""); // создали пустое хранилище, если что-то введем в "", то это отобразится в нашем input

const addTodo = () => {
  // сюда мы прописали наш метод указанный в form, при вводе какого-то текста в наше окошко(Add a todo), будет отрабатывать
  const newTodo = {
    id: uuidv4(), // ???????????
    content: newtodoContent.value,
    // так как ref принимает значение через value, то для отображения мы добавляем наше пустое хранилище и прописываем value
    done: false,
  };
  todos.value.unshift(newTodo);
  // мы указали, возьми наш массив (todos), добавь ему значение (value), добавь метод unshift (добавляет один или более элементов в начало массива и возвращает новую длину массива),
  // и в скобках мы указали наш объект в каком формате нам нужна наша запись
  newtodoContent.value = "";
  // мы указали, чтобы по умолчанию наше поле ввода было пустым
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
</style>