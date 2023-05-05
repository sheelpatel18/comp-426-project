import api from './api'
import request from 'supertest'

describe('GET /ping', () => {
  const res = request(api)
  it('should return status 200', async () => {
    const r = await res.get('/ping')
    expect(r.status).toEqual(200)
  })
  it('should return "PONG"', async () => {
    const r = await res.get('/ping')
    expect(r.text).toEqual('PONG')
  })
})