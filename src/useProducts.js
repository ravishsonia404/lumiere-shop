import { useState, useEffect } from 'react'
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
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
    await setDoc(ref, {
      ...productData,
      id: newId,
    })
  }

  return { products, loading, updateProduct, addProduct }
}