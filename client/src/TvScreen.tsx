import './App.css'
import { useEffect, useState } from 'react';
import { useBackendSocket } from './Providers/BackendSocketProvider';


function TvScreen() {
  
  const {ws} = useBackendSocket()
  
  
  return (
    <div>I am the TV</div>
  )
}

export default TvScreen
