import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <div className='w-100 bg-dark mt-4 mb-0 py-2' style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
        <div className='container'>
          <div className='footer-section'>
            <p className='text-white copyright-text' style={{flex: 1}}>Copyright © 2023 MeetzFlow</p>
            <div className='legal-links-section'>
              <Link to='/privacy-policy' className='legal-links' style={{marginRight: '20px'}}>Privacy Policy</Link>
              <Link to='/terms-and-conditions' className='legal-links'>Terms And Conditions</Link>
            </div>
          </div>
        </div>
    </div>
  )
}
