import jwt from 'jsonwebtoken'
import fs from 'fs'

export default function createJWTForAppStoreConnectAPI(filepath: string, iss: string, kid: string): string | undefined {
  const privateKey = fs.readFileSync(filepath)
  const payload = {
    iss,
    // <=20 mins
    exp: Number(new Date().toString()) + 1199,
    aud: 'appstoreconnect-v1'
  }

  let t: string | undefined = ''
  jwt.sign(payload, privateKey, { algorithm: 'ES256', keyid: kid }, function(err: Error | null, token: string | undefined) {
    if(err) {
      throw new Error(err.message)
    }
    console.log(token)
    t = token
  })
  return t
}
