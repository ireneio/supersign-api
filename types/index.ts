export interface HttpResponse {
  syscode: number,
  sysmsg: string,
  data: any
}

export namespace AppStoreConnect {
  export interface HttpResponse {
    data: DeviceResponse | BundleIdResponse | CertificateResponse,
    links: {
      self: string
    },
    included? : any
  }
  export interface DeviceData {
    id: string,
    type: 'devices'
  }
  export interface DeviceResponse {
    attributes: any,
    id: string,
    type: 'devices',
    links: {
      self: string
    }
  }
  export interface BundleIdResponse {
    attributes: any,
    id: string,
    relationships: any,
    type: 'bundleIds',
    links: {
      self: string
    }
  }
  export interface CertificateData {
    id: string,
    type: 'certificates'
  }
  export interface CertificateResponse {
    attributes: {
      certificateContent: string,
      displayName: string,
      expirationDate: Date | string | number,
      name: string,
      platform: 'IOS',
      serialNumber: string,
      certificateType: 'IOS_DISTRIBUTION'
    },
    id: string,
    type: 'certificates',
    links: {
      self: string
    }
  }
  export interface ProfileResponse {
    attributes: {
      uuid: string,
      profileContent: string,
      expirationDate: Date | string | number,
      name: string,
      platform: 'IOS',
      profileState: string,
      profileType: 'IOS_APP_ADHOC'
    },
    id: string,
    relationships: {
      certificates: any,
      devices: any,
      bundleId: any
    },
    type: 'profiles',
    links: {
      self: string
    }
  }
  export interface RequestObject {
    data: {
      attributes: any,
      relationships?: any,
      type: 'certificates' | 'profiles' | 'bundleIds' | 'devices',
    }
  }
}
