import express, { Router, Request, Response } from 'express'
import { HttpResponse } from '../types/index'
import xmlparser from 'express-xml-bodyparser'
import createJwt from '../utils/jwt'
import { getDevices, createDevice, createProvisioningProfile, downloadProvisioningProfile } from '../utils/appstoreConnect'
import { AppStoreConnect } from '../types/index'
import { addJwtToRequestHeaders } from '../utils/api'

const router: Router = express.Router()

/* POST sign. */
router.post('/', xmlparser({ trim: false, explicitArray: false }), async function(req: Request, res: Response, next: Function): Promise<void> {
  const responseObject: HttpResponse = {
    syscode: 200,
    sysmsg: 'success',
    data: ''
  }

  // get udid
  const udid = req.body.plist.dict.string[2]

  console.log(udid)

  // TODO: get account from DB

  // add jwt to headers
  const jwt: string | undefined = createJwt('path to private key', 'iss', 'kid')
  if(jwt) {
    addJwtToRequestHeaders(jwt)
  } else {
    responseObject.syscode = 500
    responseObject.sysmsg = 'Failed to created JWT.'
    res.send(responseObject)
  }

  try {
    let devices: AppStoreConnect.DeviceResponse[] = []
    let certificates: AppStoreConnect.CertificateResponse[] = []
    let profileId: string = ''

    const devicesInAccount: boolean | AppStoreConnect.DeviceResponse[] = await getDevices(udid)
    if(devicesInAccount instanceof Array) {
      devices = [...devicesInAccount]
      const device = devicesInAccount.find((deviceDetail: AppStoreConnect.DeviceResponse) => {
        return deviceDetail.attributes.udid.toString() === udid
      })
      if(device !== undefined) {
        // device already exists, sign
      } else {
        // device does not exist
        await createDevice(udid)
        const profile: boolean | AppStoreConnect.ProfileResponse = await createProvisioningProfile(udid, 'bundleID', [...certificates], [...devices])
        if(typeof profile !== 'boolean') {
          profileId = profile.id
          const profileData = await downloadProvisioningProfile(profileId)
          if(typeof profileData !== 'boolean') {
            // TODO: got profile information, store in local
          }
        }
      }
    } else {
      // request failed
      responseObject.syscode = 500
      responseObject.sysmsg = 'Failed to get device information.'
      res.send(responseObject)
    }
  } catch(e) {
    responseObject.syscode = 500
    responseObject.sysmsg = e.message
    res.send(responseObject)
  }

  res.send(responseObject)
})

export default router



