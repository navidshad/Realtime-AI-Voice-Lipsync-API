import type { FC } from 'react'

import type { MotionDivProps } from './motion-div.types'

const MotionDiv: FC<MotionDivProps> = ({ children, index }) => {
  return (
    <div
      className="motion-div"
      style={{ animationDelay: `${0.15 * (index % 12)}s` }}
    >
      {children}
    </div>
  )
}

export default MotionDiv;