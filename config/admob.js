import { Platform } from 'react-native';

export const iosAdUnitID = 'ca-app-pub-6025972467008506/8585566218'
export const androidAdUnitID = 'ca-app-pub-6025972467008506/3773472672'
export const adUnitID = () => {
    return Platform.OS == 'ios' ? iosAdUnitID : androidAdUnitID
}
