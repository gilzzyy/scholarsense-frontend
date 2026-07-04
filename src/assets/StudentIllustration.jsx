import React from 'react';
import Svg, { Circle, Rect, Path, Text as SvgText } from 'react-native-svg';

export default function StudentIllustration({ size = 220 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 220 220" fill="none">
      <Circle cx="110" cy="100" r="92" fill="#DCEAE0" />
      <Rect x="40" y="55" width="16" height="16" rx="4" fill="#16213A" transform="rotate(18 48 63)" />
      <Circle cx="172" cy="62" r="9" fill="#F2C744" />
      <Rect x="158" y="118" width="14" height="14" rx="3" fill="#E96A8B" transform="rotate(-12 165 125)" />
      <Circle cx="44" cy="130" r="7" fill="#3B5BDB" />

      {/* body */}
      <Path d="M70 190c0-30 18-46 40-46s40 16 40 46" fill="#9DBE9A" />
      {/* legs crossed */}
      <Path d="M70 188c10-14 28-18 40-12 12-6 30-2 40 12v10H70v-10z" fill="#B8CDB6" />

      {/* hoodie body */}
      <Path
        d="M62 150c0-30 22-50 48-50s48 20 48 50c0 8-6 14-14 14H76c-8 0-14-6-14-14z"
        fill="#1F4E79"
      />
      {/* hoodie pocket */}
      <Rect x="92" y="138" width="36" height="20" rx="8" fill="#173E63" />
      {/* hood */}
      <Path d="M70 110c0-24 18-40 40-40s40 16 40 40c-10-10-26-16-40-16s-30 6-40 16z" fill="#163A5C" />

      {/* head */}
      <Circle cx="110" cy="92" r="30" fill="#2E5C8A" />
      <Circle cx="110" cy="96" r="24" fill="#F3C9A0" />

      {/* hair */}
      <Path d="M86 86c0-16 12-26 24-26s24 10 24 26c-6-6-14-9-24-9s-18 3-24 9z" fill="#16213A" />

      {/* face - closed happy eyes & smile */}
      <Path d="M100 98c2 3 4 3 6 0" stroke="#16213A" strokeWidth="2" strokeLinecap="round" />
      <Path d="M114 98c2 3 4 3 6 0" stroke="#16213A" strokeWidth="2" strokeLinecap="round" />
      <Path d="M104 108c3 3 9 3 12 0" stroke="#16213A" strokeWidth="2" strokeLinecap="round" />
      <Circle cx="96" cy="104" r="3" fill="#F2A98E" opacity="0.6" />
      <Circle cx="124" cy="104" r="3" fill="#F2A98E" opacity="0.6" />

      {/* hand on cheek */}
      <Circle cx="92" cy="104" r="9" fill="#F3C9A0" />

      {/* book */}
      <Path d="M88 156c10-6 24-6 34 0v22c-10-6-24-6-34 0v-22z" fill="#E58A3D" />
      <Path d="M156 156c-10-6-24-6-34 0v22c10-6 24-6 34 0v-22z" fill="#E58A3D" />
      <Path d="M122 156v22" stroke="#B9651E" strokeWidth="2" />

      {/* badge S on hoodie */}
      <Circle cx="110" cy="148" r="9" fill="#F2C744" />
      <SvgText x="110" y="153" fontSize="11" fontWeight="700" fill="#1F4E79" textAnchor="middle">
        S
      </SvgText>
    </Svg>
  );
}
