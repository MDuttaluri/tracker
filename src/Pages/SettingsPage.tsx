import React from 'react'
import CompactNav from '../Components/CompactNav/CompactNav'

function SettingsPage() {
    return (
        <div>
            <CompactNav backTo='/' content='Settings' />
            <div className='outerDiv grid--center'>
                <form className='form'>
                    <div className='formRow'>
                        <label>App theme : </label>
                        <div className='sliderOuter'>

                        </div>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default SettingsPage