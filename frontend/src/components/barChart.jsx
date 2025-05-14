import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

const githubHandle = localStorage.getItem('githubHandle');
const SHA = '';

const BarChart = ({ animate }) => {
  const [repoData, setRepoData] = useState([]);

  useEffect(() => {
    const fetchRepoData = async () => {
      if (!githubHandle) return;

      try {
        const res = await fetch(`https://api.github.com/users/${githubHandle}/repos`, {
            headers: {
                Authorization: `token ${SHA}`
            }
        });
        const repos = await res.json();

        const repoStats = await Promise.all(repos.map(async repo => {
          const commitsRes = await fetch(`https://api.github.com/repos/${githubHandle}/${repo.name}/commits`, {
            headers: {
                Authorization: `token ${SHA}`
            }
        });
          const commits = await commitsRes.json();

          return {
            mood: repo.name,
            count: Array.isArray(commits) ? commits.length : 0
          };
        }));

        const topRepos = repoStats.sort((a, b) => b.count - a.count).slice(0, 5);
        setRepoData(topRepos);
      } catch (err) {
        console.error("GitHub API fetch failed:", err);
      }
    };

    fetchRepoData();
  }, []);

  useEffect(() => {
    if (!animate || repoData.length === 0) return;

    d3.select('#bar-chart').selectAll('svg').remove();

    const width = window.innerWidth * 0.8;
    const height = window.innerHeight * 0.5;
    const margin = { top: 60, right: 50, bottom: 100, left: 70 };

    const svg = d3.select('#bar-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('font-family', 'Poppins');

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleBand()
      .domain(repoData.map(d => d.mood))
      .range([0, chartWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(repoData, d => d.count)])
      .nice()
      .range([chartHeight, 0]);

    const chart = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const colorScale = d3.scaleOrdinal()
      .domain(repoData.map(d => d.mood))
      .range(d3.schemeSet2);

    const tooltip = d3.select('#bar-chart')
      .append('div')
      .style('position', 'absolute')
      .style('background-color', '#555')
      .style('padding', '5px')
      .style('border', '1px solid #444')
      .style('color', '#fff')
      .style('border-radius', '4px')
      .style('visibility', 'hidden')
      .style('font-family', 'Poppins');

    chart.selectAll('.bar')
      .data(repoData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.mood))
      .attr('y', chartHeight)
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .style('fill', d => colorScale(d.mood))
      .on('mouseover', function (event, d) {
        tooltip.style('visibility', 'visible')
          .html(`<strong>${d.count}</strong> commits in <strong>${d.mood}</strong>`)
          .style('font-size', '1.2em');
        d3.select(this).style('opacity', 0.6);
      })
      .on('mousemove', function (event) {
        tooltip.style('top', (event.pageY - 100) + 'px')
          .style('left', (event.pageX - 20) + 'px');
      })
      .on('mouseout', function () {
        tooltip.style('visibility', 'hidden');
        d3.select(this).style('opacity', 1);
      })
      .transition()
      .duration(1500)
      .ease(d3.easeCubicOut)
      .attr('y', d => yScale(d.count))
      .attr('height', d => chartHeight - yScale(d.count));

    chart.selectAll('.label')
      .data(repoData)
      .enter()
      .append('text')
      .attr('x', d => xScale(d.mood) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.count) - 5)
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-size', '1em')
      .style('font-family', 'Poppins')
      .text(d => d.count);

    const xAxisGroup = chart.append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale));

    // Wrap X-axis labels
    xAxisGroup.selectAll('text')
      .style('text-anchor', 'middle')
      .style('font-family', 'Poppins')
      .style('font-size', '1.4em')
      .each(function () {
        const text = d3.select(this);
        const words = text.text().split(/[\s-_]/);
        text.text(null);
        words.forEach((word, i) => {
          text.append('tspan')
            .text(word)
            .attr('x', 0)
            .attr('dy', i === 0 ? '0em' : '1em');
        });
      });

    chart.append('text')
      .attr('y', chartHeight + margin.bottom)
      .attr('x', chartWidth / 2)
      .attr('fill', 'white')
      .style('font-size', '1.2em')
      .style('font-family', 'Poppins')
      .style('text-anchor', 'middle')
      .text('Repositories');

    chart.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .style('font-family', 'Poppins')
      .style('font-size', '1.1em');

    chart.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 15)
      .attr('x', -chartHeight / 2)
      .attr('fill', 'white')
      .style('font-size', '1.2em')
      .style('font-family', 'Poppins')
      .style('text-anchor', 'middle')
      .text('Commit Count');
  }, [animate, repoData]);

  return <div id="bar-chart" style={{ fontFamily: 'Poppins' }}></div>;
};

export default BarChart;