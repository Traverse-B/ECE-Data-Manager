import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar} from 'recharts';

function lineOfBestFit(data) {
  const yValues = data.map(a => a["Progress Data"]);
  const xValues = data.map((a, index) => index);
  let sumX = 0; let sumY = 0; let sumXX = 0; let sumXY = 0; let count = 0;
  for (var v = 0; v < xValues.length; v++) {
      if (yValues[v]) {
        let x = xValues[v];
        let y = yValues[v];
        alert(y)
        sumX += x;
        sumY += y;
        sumXX += x*x;
        sumXY += x*y;
        count++;
      }
  }

  var m = (count*sumXY - sumX*sumY) / (count*sumXX - sumX*sumX);
  var b = (sumY/count) - (m*sumX)/count;

  return [b, (b + m*(data.length -1))]
}

export class IepChart extends PureComponent {

  render() {
    let data = this.props.data;
    /*
    if (this.props.data && this.props.data.length > 1) {
      data = this.props.data
      const trendLine = lineOfBestFit(data)
      data[0]["Trend Line"] = trendLine[0];
      data[data.length - 1]["Trend Line"] = trendLine[1];
    }
    */
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
          <YAxis domain={[0, 100]}  scale="linear"/>
          <Tooltip />
          <Legend />
          <Line dataKey="Progress Data" stroke="blue" activeDot={{ r: 8 }} />
          <Line connectNulls dataKey="Goal Line" stroke="rgb(136, 228, 124)" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}


  
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
      const attendanceData = this.props.data;
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
              {attendanceData.map((entry, index) => (
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



  
  
  export class BipChart extends PureComponent {
  
    render() {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={this.props.data}
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
  
    render() {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={300} height={200}>
            <Pie
              data={this.props.data}
              cx="40%"
              cy="60%"
              labelLine={false}
              label={renderCustomizedLabelMeta}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {this.props.data.map((entry, index) => (
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


  

