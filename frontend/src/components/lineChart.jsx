import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

const LineChart = ({ animate }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const githubHandle = localStorage.getItem('githubHandle');
  const SHA = '';

  useEffect(() => {
    const fetchRepoData = async () => {
      if (!githubHandle) return;
  
      try {
        const res = await fetch(`https://api.github.com/users/${githubHandle}/repos`, {
          headers: {
            Authorization: `token ${SHA}`,
          },
        });
        const repos = await res.json();
  
        const repoStats = await Promise.all(
          repos.map(async (repo) => {
            const commitsRes = await fetch(
              `https://api.github.com/repos/${githubHandle}/${repo.name}/commits`,
              {
                headers: {
                  Authorization: `token ${SHA}`,
                },
              }
            );
            const commits = await commitsRes.json();
  
            const formattedLogs = commits.map((commit) => ({
              date: new Date(commit.commit.author.date),
              entries: 1,
            }));
  
            const aggregated = d3
              .rollups(
                formattedLogs,
                (v) => v.length,
                (d) => d3.timeDay(d.date)
              )
              .map(([date, entries]) => ({ date, entries }));
  
            return aggregated;
          })
        );
  
        // Flatten all aggregated repo stats (if needed) and set logs
        const allLogs = repoStats.flat();
        setLogs(allLogs);
  
      } catch (err) {
        console.error('Error fetching commit data:', err);
        setError('Failed to load commit data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchRepoData();
  }, [githubHandle]); // Trigger when githubHandle changes
  
  
  useEffect(() => {
    if (!animate || !logs.length) return;

    d3.select('#line-chart').selectAll('*').remove();

    const margin = { top: 40, right: 50, bottom: 60, left: 70 };
    const container = document.getElementById('line-chart');
    const width = container.clientWidth - margin.left - margin.right;
    const height = container.clientHeight - margin.top - margin.bottom;

    const svg = d3.select('#line-chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'line-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0)
      .attr('y1', height)
      .attr('x2', 0)
      .attr('y2', 0);

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#4F9DA6')
      .attr('stop-opacity', 0.2);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#4F9DA6')
      .attr('stop-opacity', 0.8);

    const xScale = d3.scaleTime()
      .domain(d3.extent(logs, d => d.date))
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(logs, d => d.entries) * 1.2])
      .range([height, 0]);

    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(5).tickSize(-height).tickFormat(''))
      .style('stroke-opacity', 0.1);

    svg.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale).ticks(5).tickSize(-width).tickFormat(''))
      .style('stroke-opacity', 0.1);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(5))
      .style('color', '#E6E6FA')
      .style('font-size', '12px')
      .call(g => g.select('.domain').remove());

    svg.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .style('color', '#E6E6FA')
      .style('font-size', '12px')
      .call(g => g.select('.domain').remove());

    const line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.entries))
      .curve(d3.curveMonotoneX);

    const area = d3.area()
      .x(d => xScale(d.date))
      .y0(height)
      .y1(d => yScale(d.entries))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(logs)
      .attr('class', 'area')
      .attr('d', area)
      .style('fill', 'none')
      .style('opacity', 0)
      .transition()
      .duration(1500)
      .style('opacity', 1);

    const path = svg.append('path')
      .datum(logs)
      .attr('fill', 'none')
      .attr('stroke', '#4F9DA6')
      .attr('stroke-width', 3)
      .attr('d', line);

    const totalLength = path.node().getTotalLength();
    path
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);

    const dots = svg.selectAll('.dot')
      .data(logs)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.entries))
      .attr('r', 0)
      .style('stroke', 'white')
      .style('stroke-width', 2)
      .transition()
      .delay((d, i) => i * 150)
      .duration(500)
      .attr('r', 6);

    const tooltip = d3.select('#line-chart')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'rgba(47, 47, 47, 0.9)')
      .style('padding', '10px')
      .style('border-radius', '5px')
      .style('color', '#fff')
      .style('font-size', '12px')
      .style('pointer-events', 'none');

    svg.selectAll('.dot')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 8)
          .style('fill', '#4F9DA6');

        tooltip
          .style('visibility', 'visible')
          .html(`
            <div style="font-family: Poppins, sans-serif">
              <strong>Date:</strong> ${d.date.toLocaleDateString()}<br>
              <strong>Commits:</strong> ${d.entries}
            </div>
          `);
      })
      .on('mousemove', function(event) {
        tooltip
          .style('top', `${event.pageY - 10}px`)
          .style('left', `${event.pageX + 10}px`);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 6)
          .style('fill', '#A4D3B1');

        tooltip.style('visibility', 'hidden');
      });

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 15)
      .attr('x', -height / 2)
      
      .style('font-size', '14px')
      .style('text-anchor', 'middle')
      .text('Number of Commits');

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .style('font-size', '14px')
      .style('text-anchor', 'middle')
      .text('Date');
  }, [logs, animate]);

  if (loading) {
    return (
      <div id="line-chart" style={containerStyle}>
        <div style={loadingStyle}>Loading commit data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="line-chart" style={containerStyle}>
        <div style={errorStyle}>{error}</div>
      </div>
    );
  }

  return <div id="line-chart" style={containerStyle} />;
};

const containerStyle = {
  width: '100%',
  height: '400px',
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '15px',
  padding: '20px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(5px)',
  position: 'relative'
};

const loadingStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  color: '#E6E6FA',
  fontSize: '16px',
  fontFamily: 'Poppins, sans-serif'
};

const errorStyle = {
  ...loadingStyle,
  color: '#FF6B6B'
};

export default LineChart;