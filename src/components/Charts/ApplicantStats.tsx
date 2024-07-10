import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import styles from './ApplicantStats.module.scss'; // Adjust the path as necessary
interface Props {
  applicants: { status: string }[];
}

const ApplicantStats: React.FC<Props> = ({ applicants }) => {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(chartRef.current);
    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const radius = Math.min(width, height) / 2;

    const statusCounts = applicants.length === 0
      ? new Map([["No Applicants", 1]])
      : d3.rollup(
          applicants,
          v => v.length,
          d => d.status
        );

    const pie = d3.pie<[string, number]>().value(d => d[1]);
    const data = pie(Array.from(statusCounts));

    const arc = d3.arc<d3.PieArcDatum<[string, number]>>()
      .innerRadius(0)
      .outerRadius(radius);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    svg.selectAll('*').remove();

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Draw pie slices
    g.selectAll('path')
      .data(data)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(d.data[0]));

    // Add labels to each slice
    g.selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '5px')
      .attr('text-anchor', 'middle')
      .text(d => d.data[1]);

    // Legend
// Legend
const legend = svg.append('g')
  .attr('font-family', 'sans-serif')
  .attr('font-size', 10)
  .attr('text-anchor', 'start') // Change text anchor to 'start' for alignment
  .selectAll('g')
  .data(Array.from(statusCounts.keys()))
  .enter().append('g')
  .attr('transform', (d, i) => `translate(${width - 150}, ${20 + i * 20})`); // Assuming the SVG width is 300, adjust accordingly

legend.append('rect')
  .attr('x', 0) // Adjust rect x position to 0
  .attr('width', 19)
  .attr('height', 19)
  .attr('fill', color);

legend.append('text')
  .attr('x', 24) // Adjust text x position to align after the rectangle
  .attr('y', 9.5)
  .attr('dy', '0.32em')
  .text(d => d);

  }, [applicants]);

  return (
    <div className={styles.chart}>
      <h2>Applicant Status Distribution</h2>
      <svg ref={chartRef} width="300" height="200"></svg>
    </div>
  );
};

export default ApplicantStats;