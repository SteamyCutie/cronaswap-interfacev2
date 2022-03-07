import QuestionHelper from '../QuestionHelper'
import React, { useState } from 'react'
import Settings from '../Settings'
import { url } from 'inspector'

export type Color = 'pink' | 'blue'

const COLOR = {
  pink: 'checked:bg-pink checked:border-transparent focus:ring-pink',
  blue: 'checked:bg-blue checked:border-blue focus:ring-blue',
}

export interface CheckboxProps {
  color: Color
  set: (value: boolean) => void
  checked?: boolean
}

function Checkbox({
  color,
  set,
  className = '',
  checked = false,
  ...rest
}: CheckboxProps & React.InputHTMLAttributes<HTMLInputElement>): JSX.Element {
  const [isChecked, setChecked] = useState(checked)
  return (
    <div className="form-check my-1">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(event) => { setChecked(event.target.checked); set(event.target.checked) }}
        className={`form-check-input appearance-none h-[18px] w-[18px] rounded-sm bg-dark-700 border-[1px] border-gray-600 disabled:bg-dark-1000 disabled:border-dark-800 transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left cursor-pointer ${COLOR[color]} ${className}`}
        style={{ backgroundImage: isChecked ? `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10l3 3l6-6'/%3e%3c/svg%3e")` : '' }}
        {...rest}
      />
    </div>
  )
}

export default Checkbox
