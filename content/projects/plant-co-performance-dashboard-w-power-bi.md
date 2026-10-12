---
title: "'Plant Co.' Performance Dashboard w/ Power BI"
date: "2025-03-16"
category: "Dashboards"
summary: "Interact with the dashboard on Power BI here!"
image: "/images/screenshot-202025-03-17-20182820.jpg"
---
[Interact with the dashboard on Power BI here!](https://app.powerbi.com/view?r=eyJrIjoiOWE2OGM3NjgtNGQzNS00NGQyLWJjMmMtMTk0MDQ5ZDE5ZDI0IiwidCI6IjY4ZDQ1MzNjLWVhZTYtNDgzMy05OWNjLTdhOTcwNGFjODcwYiIsImMiOjZ9)

In this post, I'll walk through my process of developing a comprehensive sales performance dashboard for fictitious nursery store Plant Co. using Power BI.

The goal was to build an interactive dashboard that would allow Plant Co. executives to track product quantity performance across different countries and time periods. The dashboard needed to provide both high-level KPIs and the ability to drill down into specific areas of concern.

## Understanding the Data

The project began with an Excel file containing four primary tables:

-   Products (information about plant product families, types, and groups)
-   Dates (calendar information with flags for time periods)
-   Accounts (customer information including location data)
-   Sales Facts (transaction data including quantities sold, prices, and costs)

The initial data exploration revealed a classic star schema opportunity, with the Sales Facts table at the center connected to the three dimension tables.

![](/images/screenshot-202025-03-17-20183114.png)

Star Schema: Sales table surrounded by dimensions tables for Product, Date, and Account information (as well as tables for Measures and Slicer Values which will be relevant when visualizing)

## Data Transformation in Power Query

Before building visualizations, I performed several data transformation steps using Power Query:

1.  **Cleaned column names** for consistency across all tables
2.  **Validated data types** (especially for numeric fields like quantity and price)
3.  **Created calculated columns** where needed (e.g., profit calculations)
4.  **Handled null values** in key fields to ensure data integrity

![](/images/screenshot-202025-03-17-20200511.png)

Once I confirmed in Power Query that there were no anomalies in any of my tables, I loaded them into the PBI backend

## Building the Data Model

The data modeling phase was critical for setting up useful visualizations in the next step. I:

1.  **Established relationships** between the fact and dimension tables
2.  **Created hierarchies** for products and geography to enable drill-down analysis
3.  **Developed key measures** using DAX:
    -   YTD (Year-to-Date) quantity
    -   PYTD (Previous Year-to-Date) quantity
    -   Growth percentage calculations

![](/images/screenshot-202025-03-17-20200231.png)

I used a 'Measures Table' to help navigate my model and streamline the visualization step

## Core Visualizations and Measures

The dashboard development focused on answering key business questions:

**1\. How is quantity performance trending this year compared to last?**

![](/images/screenshot-202025-03-17-20184526.png)

Card visuals for YTD, PYTD, difference, and growth percentage. The "difference card" is conditionally formatted to either green or red, depending on performance

**2\. Which countries are underperforming?**

![](/images/screenshot-202025-03-17-20184808.png)

Treemap showing bottom 10 countries by YTD vs PYTD difference. In this case, Greece is selected. This slices the waterfall chart on the right, revealing the insight that the difference in quantity of their sales fall throughout the months.

**3\. How are different product types performing across the year?**

![](/images/screenshot-202025-03-17-20185522.png)

Stacked column chart showing monthly performance by product type, with a trend line showing previous year values for comparison

**4\. What's the relationship between quantity and profitability?**

![](/images/screenshot-202025-03-17-20185640.png)

Scatter chart with GP% on the y-axis and quantity on the x-axis. This graph shows a profitability segmentation for China, with a reference line at 40% GP to highlight accounts above/below target

## Advanced Formatting and Interactivity

To make the dashboard more usable and visually appealing:

1.  **Applied conditional formatting** to highlight positive/negative performance
2.  **Created dynamic chart titles** that update based on selections
3.  **Implemented consistent color schemes** across visualizations
4.  **Added interactive elements** like slicers and drill-through capabilities

The color scheme was carefully chosen to ensure accessibility while clearly indicating performance status (green for positive, red for negative).

![](/images/screenshot-202025-03-17-20195717.png)

An example of using the dashboard to drill down to a specific country and month to isolate metrics

## What Are This Dashboard's Applications in Business and KPI Tracking?

For plant retailers and wholesalers, these insights translate directly to actionable strategies:

1.  **Market-Specific Interventions:** The country-level analysis enables targeted interventions in underperforming regions, potentially through promotional campaigns, pricing adjustments, or distribution channel optimization.
2.  **Inventory Planning:** With clear visibility into monthly performance by product type, companies can optimize inventory levels to match seasonal demand patterns, reducing both stockouts and excess inventory costs.
3.  **Profitability Management:** The GP% vs Quantity analysis helps identify accounts that may be receiving excessive discounts or those with unfavorable cost structures, allowing for targeted margin improvement initiatives.
4.  **Product Development Focus:** Understanding which product categories perform best in which seasons and regions can inform product development and marketing efforts.

By continuously tracking these KPIs through the dashboard, management can quickly identify deviations from targets and implement corrective actions before issues significantly impact the bottom line!
