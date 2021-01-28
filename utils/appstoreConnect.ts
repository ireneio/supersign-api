import axios from '../utils/api'
import { AppStoreConnect } from '../types/index'

export async function createDevice(udid: string): Promise<boolean | AppStoreConnect.DeviceResponse> {
  const requestBody: AppStoreConnect.RequestObject = {
    data: {
      attributes: {
        name: udid,
        platform: 'IOS',
        udid
      },
      type: 'devices'
    }
  }
  try {
    const res = await axios.post('/devices', { ...requestBody })
    if(Number(res.status) === 201 && res.data && res.data.data) {
      return res.data.data
    } else {
      return false
    }
  } catch(e) {
    console.log('[AppStore Connect API] createDevice Error: ' + e.message)
    return false
  }
}

export async function getDevices(udid: string): Promise<boolean | Array<AppStoreConnect.DeviceResponse>> {
  try {
    const res = await axios.get(`/devices/?udid=${udid}`)
    if(Number(res.status) === 200 && res.data && res.data.data) {
      return res.data.data
    } else {
      return false
    }
  } catch(e) {
    console.log('[AppStore Connect API] getDevices Error: ' + e.message)
    return false
  }
}

export async function createBundleId(identifier: string, name: string, seedId?: string): Promise<boolean | AppStoreConnect.BundleIdResponse> {
  let requestBody: AppStoreConnect.RequestObject = {
    data: {
      attributes: {
        identifier,
        name,
        platform: 'IOS',
        seedId: ''
      },
      type: 'bundleIds'
    }
  }
  if(seedId) {
    requestBody.data.attributes.seedId = seedId
  }
  try {
    const res = await axios.post('/bundleIds', { ...requestBody })
    if(Number(res.status) === 201 && res.data && res.data.data) {
      return res.data.data
    } else {
      return false
    }
  } catch(e) {
    console.log('[AppStore Connect API] createBundleId Error: ' + e.message)
    return false
  }
}

export async function createCertificate(csrContent: string): Promise<boolean | AppStoreConnect.CertificateResponse> {
  const requestBody: AppStoreConnect.RequestObject = {
    data: {
      attributes: {
        certificateType: 'IOS_DISTRIBUTION',
        csrContent
      },
      type: 'certificates'
    }
  }
  try {
    const res = await axios.post('/certificates', { ...requestBody })
    if(Number(res.status) === 201 && res.data && res.data.data) {
      return res.data.data
    } else {
      return false
    }
  } catch(e) {
    console.log('[AppStore Connect API] createCertificate Error: ' + e.message)
    return false
  }
}

// .csr, requires conversion to p12
export async function downloadCertificate(id: string): Promise<boolean | AppStoreConnect.CertificateResponse> {
  try {
    const res = await axios.get(`/certificates/${id}`)
    if(Number(res.status) === 200 && res.data && res.data.data) {
      return res.data.data
    } else {
      return false
    }
  } catch(e) {
    console.log('[AppStore Connect API] downloadCertificate Error: ' + e.message)
    return false
  }
}

export async function createProvisioningProfile(name: string, bundleId: string, certificates: Array<AppStoreConnect.CertificateData>, devices: Array<AppStoreConnect.DeviceData>): Promise<boolean | AppStoreConnect.ProfileResponse> {
  const requestBody: AppStoreConnect.RequestObject = {
    data: {
      attributes: {
        name,
        profileType: 'IOS_APP_ADHOC'
      },
      relationships: {
        bundleId,
        certificates: {
          data: [
            ...certificates
          ]
        },
        devices: {
          data: [
            ...devices
          ]
        }
      },
      type: 'profiles'
    }
  }
  try {
    const res = await axios.post('/profiles', { ...requestBody })
    if(Number(res.status) === 201 && res.data && res.data.data) {
      return res.data.data
    } else {
      return false
    }
  } catch(e) {
    console.log('[AppStore Connect API] createProvisioningProfile Error: ' + e.message)
    return false
  }
}

// requires write to local file
export async function downloadProvisioningProfile(id: string): Promise<boolean | AppStoreConnect.ProfileResponse> {
  try {
    const res = await axios.get(`/profiles/${id}`)
    if(Number(res.status) === 200 && res.data && res.data.data) {
      return res.data.data
    } else {
      return false
    }
  } catch(e) {
    console.log('[AppStore Connect API] downloadCertificate Error: ' + e.message)
    return false
  }
}
