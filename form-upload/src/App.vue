<template>
  <div id="app" class="container">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h2 class="panel-title">Add new product</h2>
      </div>
      <div class="panel-body">
        <form id="form" @submit.prevent="addProduct">
          <div class="row">
            <div class="form-group col-md-6">
              <label>Name:</label>
              <input type="text" class="form-control" v-model="newProduct.name">
            </div>
            <div class="form-group col-md-4">
              <label>Category:</label>
              <select class="form-control" v-model="newProduct.category">
                <option value="Electronic deivce">Electronic device</option>
                <option value="Smartphone">Smartphone</option>
                <option value="Laptop">Laptop</option>
              </select>
            </div>
            <div class="form-group col-md-2">
              <label>Price (USD):</label>
              <input type="number" class="form-control" v-model="newProduct.price">
            </div>
          </div>
          <div class="form-group">
            <label>Description:</label>
            <input type="text" class="form-control" v-model="newProduct.description">
          </div>
          <div class="form-group">
            <div v-if="!img">
              <h2>Select an image</h2>
              <input type="file" @change="onFileChange">
            </div>
            <div v-else>
              <img :src="img" />
              <button @click.prevent="removeImage">Remove image</button>
            </div>
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-primary">
              <i class="fa fa-upload" aria-hidden="true"></i>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="panel panel-default">
      <div class="panel-heading">
        <h2 class="panel-title">Products</h2>
      </div>
      <div class="panel-body">
        <table class="table table-striped">
          <thead>
            <tr>
              <th style="width: 170px">Name</th>
              <th style="width: 240px">Description</th>
              <th style="width: 108px">Price (USD)</th>
              <th style="width: 160px">Category</th>
              <th style="width: 300px">Image</th>
              <th style="width: 130px">Action</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="product of products">
              <tr :key="product.id" v-if="product.data().isEditting == true">
                <td>
                  <input class="form-control" v-model="edittedProduct.name">
                </td>
                <td>
                  <textarea class="form-control" v-model="edittedProduct.description"></textarea>
                </td>
                <td>
                  <input type="number" class="form-control" v-model="edittedProduct.price">
                </td>
                <td>
                  <select class="form-control" v-model="edittedProduct.category">
                    <option value="Electronic deivce">Electronic device</option>
                    <option value="Smartphone">Smartphone</option>
                    <option value="Laptop">Laptop</option>
                  </select>
                </td>
                <td>
                  <div v-if="!imgEdit">
                    <h2>Select an image</h2>
                    <input type="file" @change="onFileChangeE">
                  </div>
                  <div v-else>
                    <img :src="imgEdit" />
                    <button @click.prevent="removeImageE">Remove image</button>
                  </div>
                </td>
                <td>
                  <button class="btn-icon" @click.prevent="editProduct(product.id)">
                    <i class="fas fa-check" aria-hidden="true"></i>
                    save
                  </button>
                  /
                  <button class="btn-icon" @click.prevent="cancelEdit(product.id)">
                    <i class="fas fa-times" aria-hidden="true"></i>
                    cancel
                  </button>
                </td>
              </tr>
              <tr :key="product.id" v-else>
                <td>{{ product.data().name }}</td>
                <td>{{ product.data().description }}</td>
                <td>{{ product.data().price }}</td>
                <td>{{ product.data().category }}</td>
                <td>
                  <img :src="product.data().image" alt="No image">
                </td>
                <td v-if="!edittedProduct.isEditting">
                  <button class="btn-icon" @click.prevent="enableEdit(product.id)">
                    <i class="fas fa-edit" aria-hidden="true"></i>
                    edit
                  </button>
                  /
                  <button class="btn-icon" @click.prevent="removeProduct(product.id)">
                    <i class="fas fa-trash" aria-hidden="true"></i>
                    delete
                  </button>
                </td>
                <td v-else></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/storage'
  import toastr from 'toastr'

  var config = {
    apiKey: "AIzaSyA6TSWNCi-olLQcyZLg8Sddi2CKUiI4LLo",
    authDomain: "form-upload-vue.firebaseapp.com",
    databaseURL: "https://form-upload-vue.firebaseio.com",
    projectId: "form-upload-vue",
    storageBucket: "form-upload-vue.appspot.com",
    messagingSenderId: "726583077933"
  }

  const app = firebase.initializeApp(config)
  const firestoreApp = app.firestore()
  const storage = app.storage()

  firestoreApp.settings({
    timestampsInSnapshots: true
  })

  const productCollectionRef = firestoreApp.collection('products')
  const storageRef = storage.ref()

  export default {
    name: 'app',
    data: function () {
      return {
        products: [],
        file: File,
        fileEdit: File,
        img: '',
        imgEdit: '',
        newProduct: {
          name: '',
          description: '',
          price: '',
          category: '',
          image: '',
          isEditting: false
        },
        edittedProduct: {
          name: '',
          description: '',
          price: '',
          category: '',
          image: '',
          isEditting: false
        }
      }
    },

    methods: {
      createImage: function (file) {
        var image = new Image()
        var reader = new FileReader()
        var vm = this;

        reader.onload = (e) => {
          vm.img = e.target.result
        };
        reader.readAsDataURL(file)
      },
      createImageE: function (file) {
        var image = new Image()
        var reader = new FileReader()
        var vm = this;

        reader.onload = (e) => {
          vm.imgEdit = e.target.result
        };
        reader.readAsDataURL(file)
      },
      removeImage: function (e) {
        this.img = ''
      },
      removeImageE: function (e) {
        this.imgEdit = ''
      },
      onFileChange: function (e) {
        this.file = e.target.files
        if (!this.file.length)
          return
        this.createImage(this.file[0])
      },
      onFileChangeE: function (e) {
        this.fileEdit = e.target.files
        if (!this.fileEdit.length)
          return
        this.createImageE(this.file[0])
      },
      upload: async function (file) {
        const imageRef = storageRef.child(file.name)
        const snapshot = await imageRef.put(file)
        return snapshot.ref.getDownloadURL()
      },
      addProduct: async function () {
        try {
          if (!this.file[0]) this.newProduct.image = ''
           else this.newProduct.image = await this.upload(this.file[0])
          await productCollectionRef.add(this.newProduct)
          let productArray = []
          let querySnapshot = await productCollectionRef.get()
          querySnapshot.forEach(element => {
            productArray.push(element)
          })
          this.products = productArray
          this.newProduct = {
            name: '',
            description: '',
            price: '',
            category: '',
            image: '',
            isEditting: false
          }
          this.file = null
          this.img = ''
          toastr.success('Add new product success')
        } catch (err) {
          console.error(err);
        }
      },
      removeProduct: async function (id) {
        let cf = confirm("Do you want to delete this product?")
        if (cf) {
          await productCollectionRef.doc(id).delete()
          let productArray = []
          let querySnapshot = await productCollectionRef.get()
          querySnapshot.forEach(element => {
            productArray.push(element)
          })
          this.products = productArray
          toastr.success('Delete success')
        } else {
          toastr.success('Canceled delete')
        }
      },
      enableEdit: async function (id) {
        let getData = await productCollectionRef.doc(id).get()
        this.edittedProduct.name = getData.data().name
        this.edittedProduct.description = getData.data().description
        this.edittedProduct.price = getData.data().price
        this.edittedProduct.category = getData.data().category
        this.edittedProduct.image = getData.data().image
        this.imgEdit = this.edittedProduct.image
        this.edittedProduct.isEditting = true
        await productCollectionRef.doc(id).update({
          isEditting: true
        })
        let productArray = []
        let querySnapshot = await productCollectionRef.get()
        querySnapshot.forEach(element => {
          productArray.push(element)
        })
        this.products = productArray
        toastr.success('You can edit now')
      },
      cancelEdit: async function (id) {
        await productCollectionRef.doc(id).update({
          isEditting: false
        })
        this.edittedProduct.isEditting = false
        let productArray = []
        let querySnapshot = await productCollectionRef.get()
        querySnapshot.forEach(element => {
          productArray.push(element)
        })
        this.products = productArray
        toastr.success('Cancle edit')
      },
      editProduct: async function (id) {
        if (!this.fileEdit[0]) this.edittedProduct.image = ''
          else this.edittedProduct.image = await this.upload(this.fileEdit[0])
        await productCollectionRef.doc(id).update(this.edittedProduct)
        let productArray = []
        let querySnapshot = await productCollectionRef.get()
        querySnapshot.forEach(element => {
          productArray.push(element)
        })
        this.products = productArray
        this.edittedProduct.isEditting = false
        toastr.success('Product was editted')
      },
    },
    mounted: async function () {
      try {
        let productArray = []
        let querySnapshot = await productCollectionRef.get()
        querySnapshot.forEach(element => {
          productArray.push(element)
        })
        this.products = productArray
      } catch (err) {
        console.error(err)
      }
    },
  }
</script>
<style>
  #app {
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin-top: 20px;
  }

  .btn-icon {
    padding: 0;
    border: none;
    background: none;
  }

  .btn-icon:hover {
    color: dodgerblue;
  }

  img {
    width: 100px;
    display: block;
    margin-bottom: 10px;
  }
</style>