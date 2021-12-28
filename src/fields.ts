type MpptFields = { label: string; units: string; description: string };

export type MpptObject = typeof mpptObject;
export type MpptField = { units: string; description: string };

export const mpptObject: { [key: string]: MpptField } = {
  V: { units: 'mV', description: 'Main or channel 1 (battery) voltage' },
  VPV: { units: 'mV', description: 'Panel voltage' },
  PPV: { units: 'W', description: 'Panel power' },
  I: { units: 'mA', description: 'Main or channel 1 battery current' },
  IL: { units: 'mA', description: 'Load current' },
  LOAD: { units: '', description: 'Load output state (ON/OFF)' },
  Relay: { units: '', description: 'Relay state' },
  OR: { units: '', description: 'Off reason' },
  H19: { units: '0.01 kWh', description: 'Yield total (user resettable counter)' },
  H20: { units: '0.01 kWh', description: 'Yield today' },
  H21: { units: 'W', description: 'Maximum power today' },
  H22: { units: '0.01 kWh', description: 'Yield yesterday' },
  H23: { units: 'W', description: 'Maximum power yesterday' },
  ERR: { units: '', description: 'Error code' },
  CS: { units: '', description: 'State of operation' },
  FW: { units: '', description: 'Firmware version (16 bit)' },
  PID: { units: '', description: 'ProductID' },
  'SER#': { units: '', description: 'Serial number' },
  HSDS: { units: '', description: 'Day sequence number (0..364)' },
  MPPT: { units: '', description: 'Tracker operation mode' },
  Checksum: {
    units: 'byte',
    description:
      'All blocks end with a checksum field. The modulo 256 sum of all bytes in a block will equal 0',
  },
};

export const mpptFields: MpptFields[] = [
  {
    label: 'V',
    units: 'mV',
    description: 'Main or channel 1 (battery) voltage',
  },
  {
    label: 'VPV',
    units: 'mV',
    description: 'Panel voltage',
  },
  {
    label: 'PPV',
    units: 'W',
    description: 'Panel power',
  },
  {
    label: 'I',
    units: 'mA',
    description: 'Main or channel 1 battery current',
  },
  {
    label: 'IL',
    units: 'mA',
    description: 'Load current',
  },
  {
    label: 'LOAD',
    units: '',
    description: 'Load output state (ON/OFF)',
  },
  {
    label: 'Relay',
    units: '',
    description: 'Relay state',
  },
  {
    label: 'OR',
    units: '',
    description: 'Off reason',
  },
  {
    label: 'H19',
    units: '0.01 kWh',
    description: 'Yield total (user resettable counter)',
  },
  {
    label: 'H20',
    units: '0.01 kWh',
    description: 'Yield today',
  },
  {
    label: 'H21',
    units: 'W',
    description: 'Maximum power today',
  },
  {
    label: 'H22',
    units: '0.01 kWh',
    description: 'Yield yesterday',
  },
  {
    label: 'H23',
    units: 'W',
    description: 'Maximum power yesterday',
  },
  {
    label: 'ERR',
    units: '',
    description: 'Error code',
  },
  {
    label: 'CS',
    units: '',
    description: 'State of operation',
  },
  {
    label: 'FW',
    units: '',
    description: 'Firmware version (16 bit)',
  },
  {
    label: 'PID',
    units: '',
    description: 'ProductID',
  },
  {
    label: 'PID',
    units: '',
    description: 'ProductID',
  },
  {
    label: 'SER#',
    units: '',
    description: 'Serial number',
  },
  {
    label: 'HSDS',
    units: '',
    description: 'Day sequence number (0..364)',
  },
  {
    label: 'MPPT',
    units: '',
    description: 'Tracker operation mode',
  },
  {
    label: 'Checksum',
    units: 'byte',
    description:
      'All blocks end with a checksum field. The modulo 256 sum of all bytes in a block will equal 0',
  },
];
