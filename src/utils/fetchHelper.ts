// src/utils/fetchHelper.ts
import axios from 'axios'

export async function fetchData<T>(url: string, options = {}): Promise<T> {
  const response = await axios.get<T>(url, options)
  return response.data
}
