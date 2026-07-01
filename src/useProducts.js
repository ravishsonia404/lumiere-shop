import { useState, useEffect } from 'react'
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore'
import { db } from './firebase'
import productsData from './products'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const colRef = collection(db, 'products')
    const unsub = onSnapshot(colRef, async (snapshot) => {
      if (snapshot.empty) {
        for (const product of productsData) {
          await setDoc(doc(db, 'products', String(product.id)), {
            ...product,
            image: null,
            stock: product.stock || 10,
          })
        }
      } else {
        const loaded = snapshot.docs.map(d => ({ ...d.data(), id: d.id }))
        setProducts(loaded)
        setLoading(false)
      }
    })
    return () => unsub()
  }, [])

  async function updateProduct(id, updatedData) {
    const ref = doc(db, 'products', String(id))
    await setDoc(ref, updatedData, { merge: true })
  }

  async function addProduct(productData) {
    const newId = String(Date.now())
    const ref = doc(db, 'products', newId)
    await setDoc(ref, { ...productData, id: newId, stock: productData.stock || 10 })
  }

  async function updateStock(id, newStock) {
    const ref = doc(db, 'products', String(id))
    await updateDoc(ref, { stock: newStock })
  }

  async function reduceStock(items) {
    for (const item of items) {
      const product = products.find(p => String(p.id) === String(item.id))
      if (product && product.stock > 0) {
        const newStock = Math.max(0, product.stock - item.qty)
        await updateDoc(doc(db, 'products', String(item.id)), { stock: newStock })
      }
    }
  }

  return { products, loading, updateProduct, addProduct, updateStock, reduceStock }
}