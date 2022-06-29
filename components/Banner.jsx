
import React from 'react';
//admob
import { AdMobBanner} from 'expo-ads-admob';
import { adUnitID } from '../config/admob'


export default Banner = () =>{
  return (
    <AdMobBanner
    bannerSize="fullBanner"
    adUnitID={adUnitID()}
    servePersonalizedAds
    onDidFailToReceiveAdWithError={() => console.log('banner error')} />

  )
}