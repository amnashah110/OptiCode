import React, { useEffect } from 'react';
import * as d3 from 'd3';

const PieChart = ({ animate, tags }) => {
  useEffect(() => {
    if (!animate || !tags || tags.length === 0) return;

    // Clear previous charts
    d3.select('#pie-chart').selectAll('*').remove();
    d3.select('#legend').selectAll('*').remove();

    // Responsive dimensions
    const containerWidth = document.getElementById('pie-chart').clientWidth;
    const containerHeight = document.getElementById('pie-chart').clientHeight;
    const width = Math.min(containerWidth, window.innerWidth * 0.4);
    const height = Math.min(containerHeight, window.innerHeight * 0.4);
    const radius = Math.min(width, height) / 2.5;

    // Create SVG
    const svg = d3.select('#pie-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal()
      .domain(tags.map(tag => tag.tag))
      .range([
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
        '#FFEEAD', '#D4A5A5', '#9FA4C4', '#B5EAD7'
      ]);

    const pie = d3.pie()
      .value(d => d.count)
      .sort(null);

    const defs = svg.append('defs');
    tags.forEach((tag, i) => {
      const gradient = defs.append('linearGradient')
        .attr('id', `gradient-${i}`)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '100%');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', d3.rgb(color(tag.tag)).brighter(0.5));

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d3.rgb(color(tag.tag)).darker(0.3));
    });

    const arc = d3.arc()
      .innerRadius(radius * 0.4)
      .outerRadius(radius);

    const totalValue = d3.sum(tags, d => d.count);

    const arcs = svg.selectAll('arc')
      .data(pie(tags))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('fill', (d, i) => `url(#gradient-${i})`)
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('filter', 'drop-shadow(3px 3px 5px rgba(0,0,0,0.2))')
      .transition()
      .duration(1500)
      .ease(d3.easeBounceOut)
      .attrTween('d', function (d) {
        const interpolate = d3.interpolate(
          { startAngle: d.startAngle, endAngle: d.startAngle },
          { startAngle: d.startAngle, endAngle: d.endAngle }
        );
        return function (t) {
          return arc(interpolate(t));
        };
      });

    // Percentage labels
    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '-0.5em')
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-size', '1.2em')
      .style('font-family', 'Poppins, sans-serif')
      .style('font-weight', 'bold')
      .style('text-shadow', '2px 2px 4px rgba(0,0,0,0.4)')
      .text(d => `${((d.data.count / totalValue) * 100).toFixed(1)}%`);

    // Count labels
    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '1em')
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-size', '1em')
      .style('font-family', 'Poppins, sans-serif')
      .style('text-shadow', '2px 2px 4px rgba(0,0,0,0.4)')
      .text(d => d.data.count);

    // Legend (HTML with solid color)
    const legendContainer = d3.select('#legend')
      .append('div')
      .style('display', 'flex')
      .style('flex-direction', 'column')
      .style('gap', '10px')
      .style('padding', '20px')
      .style('background', 'rgba(255, 255, 255, 0.1)')
      .style('border-radius', '10px')
      .style('backdrop-filter', 'blur(5px)');

    const legendItems = legendContainer.selectAll('.legend-item')
      .data(tags)
      .enter()
      .append('div')
      .attr('class', 'legend-item')
      .style('display', 'flex')
      .style('align-items', 'center')
      .style('gap', '10px')
      .style('padding', '5px')
      .style('border-radius', '5px')
      .style('transition', 'all 0.3s ease')
      .on('mouseover', function () {
        d3.select(this)
          .style('background', 'rgba(255, 255, 255, 0.1)')
          .style('transform', 'translateX(5px)');
      })
      .on('mouseout', function () {
        d3.select(this)
          .style('background', 'none')
          .style('transform', 'translateX(0)');
      });

    // Solid color boxes using color scale
    legendItems.append('div')
      .style('width', '20px')
      .style('height', '20px')
      .style('border-radius', '4px')
      .style('background-color', d => color(d.tag))
      .style('border', '2px solid white');

    legendItems.append('div')
      .style('display', 'flex')
      .style('justify-content', 'space-between')
      .style('flex-grow', '1')
      .style('color', 'white')
      .style('font-family', 'Poppins, sans-serif')
      .style('font-size', '1.1em')
      .html(d => `
        <span>${d.tag}</span>
        <span style="font-weight: bold">${d.count}</span>
      `);
  }, [animate, tags]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: '30px',
        margin: '3% auto',
        flexWrap: 'wrap',
        maxWidth: '100%',
        padding: '20px'
      }}
    >
      <div
        id="pie-chart"
        style={{
          minWidth: '300px',
          maxWidth: '500px',
          height: '400px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '20px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(5px)'
        }}
      />
      <div
        id="legend"
        style={{
          flex: '0 1 250px',
          minWidth: '250px',
          height: 'fit-content'
        }}
      />
    </div>
  );
};

export default PieChart;
