import React from 'react'
import { GiveawayStatus } from '@ui/models'

export const CircleIcon = ({ fill }: { fill: string }) => {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <circle cx="5.5" cy="5.5" r="5.5" fill={fill} />
    </svg>
  )
}

export const LiveIcon = ({ fill }: { fill: string }) => {
  return (
    <svg
      width="12"
      height="11"
      viewBox="0 0 12 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.79197 1.0256C7.88102 0.380689 6.76621 0 5.56059 0C2.48973 0 0 2.4626 0 5.5C0 8.5374 2.48973 11 5.56059 11C8.63146 11 11.1212 8.5374 11.1212 5.5H5.56059L8.79197 1.0256Z"
        fill={fill}
      />
    </svg>
  )
}

export const PermissionedIcon = ({ fill = '#868A94' }: { fill?: string }) => {
  return (
    <svg
      width="12"
      height="11"
      viewBox="0 0 12 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.61009 3.40091H8.92983C8.92535 3.40091 8.92171 3.39727 8.92171 3.39279C8.92171 1.52207 7.41371 0 5.56028 0C3.70686 0 2.19886 1.52144 2.19886 3.39279C2.19886 3.39762 2.19494 3.40153 2.19011 3.40153H1.51048C0.676619 3.40153 0 4.08384 0 4.9261V9.47543C0 10.3171 0.676 11 1.51048 11H9.61071C10.4446 11 11.1212 10.3177 11.1212 9.47543V4.92548C11.1206 4.08384 10.4446 3.40091 9.61009 3.40091ZM3.81705 3.39279C3.81705 2.42244 4.5989 1.63266 5.5609 1.63266C6.5229 1.63266 7.30414 2.42244 7.30414 3.39279C7.30414 3.39762 7.30022 3.40153 7.29539 3.40153H3.82579C3.82096 3.40153 3.81705 3.39762 3.81705 3.39279Z"
        fill={fill}
      />
    </svg>
  )
}

export const ArrowIcon = ({ fill = '#3F5ACB', ...props }) => {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path
        d="M18.375 9.5C18.375 14.4015 14.4015 18.375 9.5 18.375C4.59847 18.375 0.625 14.4015 0.625 9.5C0.625 4.59847 4.59847 0.625 9.5 0.625C14.4015 0.625 18.375 4.59847 18.375 9.5Z"
        stroke={fill} //#3F5ACB
        strokeWidth="1.25"
      />
      <path
        d="M13.8539 9.57805L11.21 6.24688C10.9825 5.96051 10.5712 5.91704 10.2913 6.14921C10.0114 6.38189 9.96846 6.80276 10.1964 7.08965L11.9756 9.33156H5.65323C5.29238 9.33156 5 9.63072 5 9.99994C5 10.3692 5.29238 10.6683 5.65323 10.6683H11.9751L10.1959 12.9102C9.96846 13.1966 10.0109 13.6175 10.2908 13.8507C10.4118 13.9509 10.5572 14 10.7022 14C10.8921 14 11.0805 13.9156 11.2095 13.753L13.8534 10.4218C14.0488 10.1753 14.0488 9.82351 13.8539 9.57805Z"
        fill={fill}
      />
    </svg>
  )
}

export const StatusIcons = ({ status }: { status: GiveawayStatus }) => {
  switch (status) {
    case GiveawayStatus.RESOLVING:
      return <CircleIcon fill="#FFB438" />
    case GiveawayStatus.FINISHED:
      return <CircleIcon fill="#3F5ACB" />
    case GiveawayStatus.LIVE:
      return <LiveIcon fill="#59C174" />
    case GiveawayStatus.CANCELLED:
      return <CircleIcon fill="#FF4D4D" />
    default:
      return <CircleIcon fill="#CED0D5" />
  }
}
