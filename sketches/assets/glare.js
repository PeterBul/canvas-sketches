const _points = [
  {
    x: 342.99497487437185,
    y: 705.5276381909548,
    control: false,
    isDragging: false,
  },
  {
    x: 684.9045226130653,
    y: 707.6984924623116,
    control: false,
    isDragging: false,
  },
  {
    x: 715.2964824120603,
    y: 675.1356783919598,
    control: false,
    isDragging: false,
  },
  {
    x: 799.9597989949749,
    y: 543.7989949748744,
    control: false,
    isDragging: false,
  },
  {
    x: 804.3015075376885,
    y: 507.97989949748745,
    control: false,
    isDragging: false,
  },
  {
    x: 816.2412060301507,
    y: 338.6532663316583,
    control: false,
    isDragging: false,
  },
  {
    x: 797.7889447236181,
    y: 325.62814070351754,
    control: false,
    isDragging: false,
  },
  {
    x: 305.00502512562815,
    y: 325.62814070351754,
    control: false,
    isDragging: true,
  },
  {
    x: 157.38693467336682,
    y: 494.95477386934675,
    control: false,
    isDragging: false,
  },
  {
    x: 140.02010050251258,
    y: 547.0552763819095,
    control: false,
    isDragging: false,
  },
  {
    x: 257.2462311557789,
    y: 670.7939698492462,
    control: false,
    isDragging: false,
  },
  {
    x: 298.49246231155774,
    y: 690.3316582914573,
    control: false,
    isDragging: false,
  },
];

const _points2 = [
  {
    x: 265.92964824120605,
    y: 716.3819095477387,
    control: false,
    isDragging: false,
  },
  {
    x: 531.8592964824121,
    y: 709.8693467336684,
    control: false,
    isDragging: false,
  },
  {
    x: 560.0804020100503,
    y: 690.3316582914573,
    control: false,
    isDragging: false,
  },
  {
    x: 637.1457286432161,
    y: 579.6180904522613,
    control: false,
    isDragging: false,
  },
  {
    x: 634.9748743718593,
    y: 551.3969849246231,
    control: false,
    isDragging: false,
  },
  {
    x: 610.0100502512563,
    y: 405.9497487437186,
    control: false,
    isDragging: false,
  },
  {
    x: 610.0100502512563,
    y: 405.9497487437186,
    control: false,
    isDragging: false,
  },
  {
    x: 600.2412060301508,
    y: 390.7537688442211,
    control: false,
    isDragging: false,
  },
  {
    x: 224.68341708542712,
    y: 401.60804020100505,
    control: false,
    isDragging: false,
  },
  {
    x: 213.82914572864323,
    y: 418.9748743718593,
    control: false,
    isDragging: false,
  },
  {
    x: 163.8994974874372,
    y: 599.1557788944724,
    control: false,
    isDragging: false,
  },
  {
    x: 175.8391959798995,
    y: 618.6934673366835,
    control: false,
    isDragging: false,
  },
  {
    x: 248.56281407035175,
    y: 707.6984924623116,
    control: false,
    isDragging: true,
  },
];

export const glare = _points.map((p) => ({ ...p, x: p.x - _points[0].x }));
export const glare2 = _points2.map((p) => ({ ...p, x: p.x - _points[0].x }));
