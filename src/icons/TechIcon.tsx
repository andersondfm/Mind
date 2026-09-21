import type { ReactNode } from 'react'
import { BRAND_ICONS } from './brands'

type TechIconProps = {
  id: string
  color: string
  size?: number
}

function luma(hex: string) {
  const value = hex.replace('#', '')
  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000
}

function tileColors(hex: string) {
  const tone = luma(hex)
  if (tone > 210) return { bg: '#1b2130', fill: '#f4f6fa' }
  if (tone < 28) return { bg: '#f4f6fa', fill: '#141820' }
  return { bg: '#f4f6fa', fill: hex }
}

function Mark({
  size,
  fill,
  stroke,
  children,
}: {
  size: number
  fill?: string
  stroke?: string
  children: ReactNode
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill ?? 'none'}
      stroke={stroke}
      strokeWidth={stroke ? 1.7 : undefined}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

function stroke(c: string, children: ReactNode, size: number) {
  return (
    <Mark size={size} stroke={c}>
      {children}
    </Mark>
  )
}

function filled(c: string, children: ReactNode, size: number) {
  return (
    <Mark size={size} fill={c}>
      {children}
    </Mark>
  )
}

const SHAPES: Record<string, (c: string, size: number) => ReactNode> = {
  textbox: (c, s) =>
    stroke(
      c,
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 9h8M8 12h8M8 15h5" />
      </>,
      s,
    ),
  users: (c, s) =>
    stroke(
      c,
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.6 19c.5-3 2.6-4.6 5.4-4.6S16.3 16 16.8 19" />
        <circle cx="17" cy="8.5" r="2.2" />
        <path d="M17 14c2.2.3 3.6 1.6 4 3.6" />
      </>,
      s,
    ),
  browser: (c, s) =>
    stroke(
      c,
      <>
        <rect x="3" y="4.5" width="18" height="15" rx="2" />
        <path d="M3 9h18" />
        <circle cx="6.2" cy="6.8" r="0.7" fill={c} stroke="none" />
        <circle cx="8.4" cy="6.8" r="0.7" fill={c} stroke="none" />
      </>,
      s,
    ),
  mobile: (c, s) =>
    stroke(
      c,
      <>
        <rect x="7" y="3" width="10" height="18" rx="2" />
        <path d="M11 18.5h2" />
      </>,
      s,
    ),
  api: (c, s) =>
    stroke(
      c,
      <>
        <path d="M8 7H5.5A2.5 2.5 0 0 0 5.5 12H8" />
        <path d="M16 7h2.5a2.5 2.5 0 0 1 0 5H16" />
        <path d="M9 12h6M10 16h4" />
      </>,
      s,
    ),
  gateway: (c, s) =>
    stroke(
      c,
      <>
        <path d="M4 20V8l8-4 8 4v12" />
        <path d="M10 20v-6h4v6" />
      </>,
      s,
    ),
  lb: (c, s) =>
    stroke(
      c,
      <>
        <circle cx="6" cy="12" r="2.2" />
        <circle cx="18" cy="6" r="2.2" />
        <circle cx="18" cy="18" r="2.2" />
        <path d="M8.2 12H14l4-5.2M14 12l4 5.2" />
      </>,
      s,
    ),
  cdn: (c, s) =>
    stroke(
      c,
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M4.5 12h15M12 4c2.6 2.6 2.6 13.4 0 16M12 4c-2.6 2.6-2.6 13.4 0 16" />
      </>,
      s,
    ),
  queue: (c, s) =>
    stroke(
      c,
      <>
        <path d="M5 7h14M5 12h14M5 17h14" />
        <path d="M4 5v4M4 10v4M4 15v4" />
      </>,
      s,
    ),
  cache: (c, s) =>
    stroke(c, <path d="M13 3 6 13h6l-1 8 7-10h-6z" />, s),
  storage: (c, s) =>
    stroke(
      c,
      <>
        <ellipse cx="12" cy="7" rx="7" ry="3" />
        <path d="M5 7v10c0 1.7 3.1 3 7 3s7-1.3 7-3V7" />
      </>,
      s,
    ),
  worker: (c, s) =>
    stroke(
      c,
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 5v2M12 17v2M5 12h2M17 12h2M7.2 7.2l1.4 1.4M15.4 15.4l1.4 1.4M16.8 7.2l-1.4 1.4M8.6 15.4 7.2 16.8" />
      </>,
      s,
    ),
  webhook: (c, s) =>
    stroke(
      c,
      <>
        <path d="M8 14a4 4 0 1 1 1.2-7.8L10.5 9" />
        <path d="M16 10a4 4 0 1 1-1 7.8L13.6 15" />
        <path d="M9 15.5 12 8l3 7.5" />
      </>,
      s,
    ),
  bus: (c, s) =>
    stroke(
      c,
      <>
        <path d="M4 9h16M4 15h16" />
        <path d="M16 6l3 3-3 3M8 12l-3 3 3 3" />
      </>,
      s,
    ),
  rest: (c, s) =>
    stroke(
      c,
      <>
        <path d="M8 8h8v8H8z" />
        <path d="M5 11h3M16 13h3M11 5v3M13 16v3" />
      </>,
      s,
    ),
  grpc: (c, s) =>
    stroke(
      c,
      <>
        <circle cx="6" cy="12" r="2" />
        <circle cx="18" cy="7" r="2" />
        <circle cx="18" cy="17" r="2" />
        <path d="M8 12h6M14 12l3-4.2M14 12l3 4.2" />
      </>,
      s,
    ),
  oracle: (c, s) => stroke(c, <ellipse cx="12" cy="12" rx="8" ry="5" />, s),
  sqlserver: (c, s) =>
    stroke(
      c,
      <>
        <ellipse cx="12" cy="6.5" rx="7" ry="2.5" />
        <path d="M5 6.5v4c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-4M5 10.5v4c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-4M5 14.5v3c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-3" />
      </>,
      s,
    ),
  dynamodb: (c, s) =>
    stroke(
      c,
      <>
        <path d="M7 4h10l3 8-3 8H7l-3-8z" />
        <path d="M7 12h10" />
      </>,
      s,
    ),
  cosmos: (c, s) =>
    stroke(
      c,
      <>
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4v3M12 17v3M4 12h3M17 12h3" />
      </>,
      s,
    ),
  iis: (c, s) =>
    stroke(
      c,
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M7 12h10M12 8v8" />
      </>,
      s,
    ),
  haproxy: (c, s) =>
    stroke(
      c,
      <>
        <path d="M4 12h7M13 7h7M13 17h7" />
        <circle cx="12" cy="12" r="2" />
      </>,
      s,
    ),
  'windows-server': (c, s) =>
    filled(
      c,
      <path d="M3 4.5h8.2v7.2H3zM12.6 4.5H21v7.2h-8.4zM3 12.3h8.2V20H3zM12.6 12.3H21V20h-8.4z" />,
      s,
    ),
  ec2: (c, s) =>
    stroke(
      c,
      <>
        <rect x="5" y="6" width="14" height="12" rx="1.5" />
        <path d="M8 10h8M8 13h5" />
      </>,
      s,
    ),
  s3: (c, s) =>
    stroke(
      c,
      <>
        <path d="M5 8h14l-1.5 11H6.5z" />
        <path d="M8 8 9 4h6l1 4" />
      </>,
      s,
    ),
  lambda: (c, s) =>
    stroke(
      c,
      <>
        <path d="M6 19 11 6h2.4L18 19" />
        <path d="M10 13h5" />
      </>,
      s,
    ),
  rds: (c, s) =>
    stroke(
      c,
      <>
        <ellipse cx="12" cy="7" rx="7" ry="3" />
        <path d="M5 7v10c0 1.7 3.1 3 7 3s7-1.3 7-3V7" />
      </>,
      s,
    ),
  ecs: (c, s) =>
    stroke(
      c,
      <>
        <rect x="4" y="5" width="7" height="6" rx="1" />
        <rect x="13" y="5" width="7" height="6" rx="1" />
        <rect x="8.5" y="13" width="7" height="6" rx="1" />
      </>,
      s,
    ),
  eks: (c, s) =>
    stroke(
      c,
      <>
        <path d="M12 3 20 8v8l-8 5-8-5V8z" />
        <path d="M12 12 20 8M12 12v9M12 12 4 8" />
      </>,
      s,
    ),
  fargate: (c, s) =>
    stroke(
      c,
      <>
        <path d="M4 16c2-5 5-8 8-8s6 3 8 8" />
        <circle cx="12" cy="8" r="2" />
      </>,
      s,
    ),
  cloudfront: (c, s) =>
    stroke(
      c,
      <path d="M7 16a5 5 0 0 1 1-9.8A6 6 0 0 1 19 10c.6 0 1.5.2 2 1.2A4 4 0 0 1 19 19H8" />,
      s,
    ),
  'apigw-aws': (c, s) =>
    stroke(
      c,
      <>
        <path d="M4 12h6" />
        <rect x="10" y="8" width="6" height="8" rx="1" />
        <path d="M16 12h4" />
      </>,
      s,
    ),
  sqs: (c, s) =>
    stroke(
      c,
      <>
        <rect x="4" y="6" width="16" height="4" rx="1" />
        <rect x="4" y="10.5" width="16" height="4" rx="1" />
        <rect x="4" y="15" width="16" height="3.2" rx="1" />
      </>,
      s,
    ),
  sns: (c, s) =>
    stroke(
      c,
      <>
        <circle cx="7" cy="12" r="2.2" />
        <path d="M9.4 12H13l5-5M13 12l5 5" />
        <circle cx="18.5" cy="6.5" r="1.6" />
        <circle cx="18.5" cy="17.5" r="1.6" />
      </>,
      s,
    ),
  cloudwatch: (c, s) =>
    stroke(c, <path d="M4 16 8 10l4 5 3-7 5 8" />, s),
  iam: (c, s) =>
    stroke(
      c,
      <>
        <circle cx="12" cy="8" r="3" />
        <path d="M5 19c1-3.4 3.4-5 7-5s6 1.6 7 5" />
      </>,
      s,
    ),
  vpc: (c, s) =>
    stroke(
      c,
      <>
        <rect x="3.5" y="5" width="17" height="14" rx="2" strokeDasharray="3 2" />
        <rect x="7" y="9" width="10" height="6" rx="1" />
      </>,
      s,
    ),
  route53: (c, s) =>
    stroke(
      c,
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4v16M4.5 12h15" />
      </>,
      s,
    ),
  stepfn: (c, s) =>
    stroke(
      c,
      <>
        <rect x="8" y="3.5" width="8" height="4" rx="1" />
        <rect x="8" y="10" width="8" height="4" rx="1" />
        <rect x="8" y="16.5" width="8" height="4" rx="1" />
        <path d="M12 7.5v2.5M12 14v2.5" />
      </>,
      s,
    ),
  eventbridge: (c, s) =>
    stroke(
      c,
      <>
        <circle cx="12" cy="12" r="2" />
        <path d="M12 4v4M12 16v4M4 12h4M16 12h4M6.5 6.5l2.5 2.5M15 15l2.5 2.5M17.5 6.5 15 9M9 15l-2.5 2.5" />
      </>,
      s,
    ),
  cfn: (c, s) =>
    stroke(
      c,
      <>
        <path d="M7 19V8l5-3 5 3v11" />
        <path d="M7 12h10" />
      </>,
      s,
    ),
  secrets: (c, s) =>
    stroke(
      c,
      <>
        <rect x="6" y="10" width="12" height="9" rx="1.5" />
        <path d="M9 10V7.5a3 3 0 0 1 6 0V10" />
      </>,
      s,
    ),
  amplify: (c, s) => stroke(c, <path d="M4 18 12 4l8 14H4z" />, s),
  graphql: (c, s) =>
    stroke(
      c,
      <>
        <circle cx="12" cy="5.5" r="1.6" />
        <circle cx="5.5" cy="16" r="1.6" />
        <circle cx="18.5" cy="16" r="1.6" />
        <path d="M12 7.2 6.8 15.2M12 7.2l5.2 8M6.9 16.5h10.2" />
      </>,
      s,
    ),
  glue: (c, s) =>
    stroke(
      c,
      <path d="M8 4h8v5H8zM10 9v3H7l-2 8h14l-2-8h-3V9" />,
      s,
    ),
  athena: (c, s) =>
    stroke(
      c,
      <>
        <circle cx="11" cy="11" r="6" />
        <path d="M15.5 15.5 20 20" />
      </>,
      s,
    ),
  beanstalk: (c, s) =>
    stroke(
      c,
      <>
        <path d="M12 20V8" />
        <path d="M12 10c-4-1-6 2-5 5 3 0 5-2 5-5zM12 10c4-1 6 2 5 5-3 0-5-2-5-5z" />
      </>,
      s,
    ),
  waf: (c, s) =>
    stroke(
      c,
      <path d="M12 3 20 7v6c0 5-3.4 7.4-8 8.8C7.4 20.4 4 18 4 13V7z" />,
      s,
    ),
  kinesis: (c, s) =>
    stroke(
      c,
      <>
        <path d="M4 8c4 0 4 8 8 8s4-8 8-8" />
        <path d="M4 14c4 0 4 6 8 6s4-6 8-6" />
      </>,
      s,
    ),
  azdo: (c, s) =>
    stroke(
      c,
      <>
        <path d="M6 8 12 4l6 4v8l-6 4-6-4z" />
        <path d="M9 12h6" />
      </>,
      s,
    ),
  bicep: (c, s) =>
    stroke(
      c,
      <>
        <path d="M7 4h7a4 4 0 0 1 0 8H7z" />
        <path d="M7 12h8a4 4 0 0 1 0 8H7z" />
      </>,
      s,
    ),
}

const ALIASES: Record<string, string> = {
  'dynamo-aws': 'dynamodb',
  elasticache: 'cache',
  aurora: 'rds',
  cognito: 'iam',
  alb: 'lb',
  nlb: 'lb',
  appsync: 'graphql',
  redshift: 'sqlserver',
  'vm-azure': 'ec2',
  appservice: 'browser',
  'az-functions': 'lambda',
  'container-apps': 'ecs',
  'az-sql': 'rds',
  blob: 's3',
  'cosmos-az': 'cosmos',
  entra: 'iam',
  servicebus: 'bus',
  eventhubs: 'eventbridge',
  keyvault: 'secrets',
  apim: 'apigw-aws',
  frontdoor: 'gateway',
  appgw: 'lb',
  appinsights: 'cloudwatch',
  'az-redis': 'storage',
  logicapps: 'stepfn',
  'az-storage': 'storage',
  'flexible-pg': 'rds',
  'az-lb': 'lb',
  vnet: 'vpc',
  'az-cdn': 'cdn',
  eventgrid: 'eventbridge',
}

export function iconTileStyle(color: string) {
  return tileColors(color)
}

export function TechIcon({ id, color, size = 18 }: TechIconProps) {
  const brand = BRAND_ICONS[id]
  const { fill } = tileColors(color)

  if (brand) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill={fill}
      >
        <path d={brand.path} />
      </svg>
    )
  }

  const shapeId = ALIASES[id] ?? id
  const shape = SHAPES[shapeId]
  if (shape) return shape(fill, size)

  return (
    <Mark size={size} stroke={fill}>
      <rect x="5" y="5" width="14" height="14" rx="3" />
    </Mark>
  )
}
