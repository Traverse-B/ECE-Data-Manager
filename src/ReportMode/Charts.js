import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar} from 'recharts';

const data = [
    {
      name: '2020/01/20',
      "Progress Data": 40,
      "Goal Line": 35
    },
    {
      name: '2020/02/6',
      "Progress Data": 47
    },
    {
      name: '2020/02/20',
      "Progress Data": 66
    },
    {
      name: '2020/03/04',
      "Progress Data": 60
    },
    {
      name: '2020/03/18',
      "Progress Data": 74
    },
    {
      name: '2020/04/02',
      "Progress Data": 48
    },
    {
      name: '2020/04/16',
      "Progress Data": 78,
      "Goal Line": 80    
    }
]

function lineOfBestFit(data) {
  const yValues = data.map(a => a["Progress Data"]);
  const xValues = data.map((a, index) => index);
  let sumX = 0; let sumY = 0; let sumXX = 0; let sumXY = 0; let count = 0;
  for (var v = 0; v < xValues.length; v++) {
      let x = xValues[v];
      let y = yValues[v];
      sumX += x;
      sumY += y;
      sumXX += x*x;
      sumXY += x*y;
      count++;
  }

  var m = (count*sumXY - sumX*sumY) / (count*sumXX - sumX*sumX);
  var b = (sumY/count) - (m*sumX)/count;

  return [b, (b + m*(data.length -1))]
}

export class IepChart extends PureComponent {

  render() {
    if (data.length > 1) {
      const trendLine = lineOfBestFit(data)
      data[0]["Trend Line"] = trendLine[0];
      data[data.length - 1]["Trend Line"] = trendLine[1];
    }
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line dataKey="Progress Data" stroke="blue" activeDot={{ r: 8 }} />
          <Line connectNulls dataKey="Goal Line" stroke="rgb(136, 228, 124)" />
          {data.length > 1 && <Line connectNulls dataKey="Trend Line" stroke="rgb(214, 223, 212)" />}
        </LineChart>
      </ResponsiveContainer>
    );
  }
}

const attendanceData = [
    { name: 'Marked present', value: 300 },
    { name: 'Marked excused', value: 300 },
    { name: 'Marked absent', value: 200 },
  ];
  
  const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  export class AttendanceChart extends PureComponent {
    static demoUrl = 'https://codesandbox.io/s/pie-chart-with-customized-label-dlhhj';
  
    render() {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={300} height={200}>
            <Pie
              data={attendanceData}
              cx="40%"
              cy="60%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="top" align="right" height={16}/>
          </PieChart>
        </ResponsiveContainer>
      );
    }
  }



  const bipData = [
    {
      name: '2020/01/20',
      Incidents: 2
    },
    {
      name: '2020/02/6',
      Incidents: 0
    },
    {
      name: '2020/02/20',
      Incidents: 4
    },
    {
      name: '2020/03/04',
      Incidents: 0
    },
    {
      name: '2020/03/18',
      Incidents: 6
    },
    {
      name: '2020/04/02',
      Incidents: 8
    },
    {
      name: '2020/04/16',
      Incidents: 0
    },
  ];
  
  export class BipChart extends PureComponent {
  
    render() {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={bipData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Incidents" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      );
    }
  }

  const metaData = [
    { name: 'Yes', value: 300 },
    { name: 'No', value: 400 }
  ];

  const METACOLORS = ['#00C49F', '#FF8042'];
  
  const MRADIAN = Math.PI / 180;
  const renderCustomizedLabelMeta = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * MRADIAN);
    const y = cy + radius * Math.sin(-midAngle * MRADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  export class MetaChart extends PureComponent {
    static demoUrl = 'https://codesandbox.io/s/pie-chart-with-customized-label-dlhhj';
  
    render() {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={300} height={200}>
            <Pie
              data={metaData}
              cx="40%"
              cy="60%"
              labelLine={false}
              label={renderCustomizedLabelMeta}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={METACOLORS[index % METACOLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="top" align="right" height={16}/>
          </PieChart>
        </ResponsiveContainer>
      );
    }
  }


  

