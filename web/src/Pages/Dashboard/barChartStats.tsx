import React, { FC } from 'react';
import { Skeleton } from 'antd';
import Chart from 'react-apexcharts';
import { InfoCircle } from 'react-bootstrap-icons';
import moment from 'moment';

export interface BarChartStatsProps {
  id: string;
  title: string;
  options: any;
  series: any;
  lastUpdate: number;
  loading: boolean;
}

const BarChartsStat: FC<BarChartStatsProps> = (props: BarChartStatsProps) => {
  const { id, title, options, series, lastUpdate, loading } = props;
  return (
    <div className="stastics-and-pie-card height-bar-rem">
      <div className="pie-charts-top">
        <div className="pie-charts-title">{title}</div>
        <div className="info-container">
          <InfoCircle color="#000000" size={20} />
        </div>
      </div>
      {loading ? (
        <div className="margin-top-2">
          <Skeleton active />
          <Skeleton active />
        </div>
      ) : (
        <>
          <div className="pie-charts-section">
            <Chart
              id={id}
              options={options}
              series={series}
              type="bar"
              height="350px"
              width="490px"
            />
          </div>
          <div className="updated-on">
            <div className="updated-moment-container">{moment(lastUpdate).fromNow()}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default BarChartsStat;
