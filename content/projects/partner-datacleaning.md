---
title: "Partner Engineering - Data Cleaning and Exploratory Data Analysis"
date: "2024-06-15"
category: "Capstone"
summary: "Data cleaning and wrangling on a proprietary dataset provided by Partner\n                            Engineering, containing millions of data points on various commercial real estate\n                            properties. Transformations were made to the dataset to prepare it for data analysis, where\n                            correlations between structural attributes was explored and evaluated as potential inputs to\n                            the machine learning model."
image: "/images/phq__2380_edited_12.5.19__281_29-1.jpg"
---
Browse the [official project website](https://sites.google.com/uci.edu/stats170group3/home) with progress presentations!

View the code for this portion of the project at [Deepnote](https://deepnote.com/workspace/ellies-workspace-9b97b54c-1267-4be2-9313-38a8e60d8790/project/Partner-Eng-Models-aa72ad5b-4609-409b-ae7e-8a5fd2e73142/notebook/[FULL]%201%3A%20Building%20Cleaned%20Dataset-a7a29f016aa34658b5bbddb6b2364d46) or [Github](https://github.com/wacsvn/partner-eng/blob/main/%5BFULL%5D%201%3A%20Building%20Cleaned%20Dataset.ipynb)!

View the report document detailing the entire process [here](https://drive.google.com/file/d/1VdOpE-CD_b0SUzv4uFk8qysgLEToqyyS/view?usp=sharing)!

Partner is the leading provider of engineering, environmental, construction, energy, and valuation consulting for the commercial real estate industry.

In hopes of simplifying their Property Condition Assessment (PCA) report, this project aimed to assess the associations between different structural component attributes, and to evaluate whether certain attributes imply the presence of others.

![](/images/screenshot-202024-06-05-20at-206.41.48-e2-80-afpm.png)

Potential Structural Relationships Based on Domain Knowledge

## Goals:

-   Evaluate the correlation between the key attributes given to us via a set of hypotheses based on Partner’s domain knowledge
    -   The hypotheses are relevant to the data variables collected in Sections 1, 4, and 5 of the PCA report.
-   Based on these correlations, build a model that is able to predict the wood frame presence based on our chosen predictors as a base to what could evolve into an autofill system for the PCA reports.

# **Data Wrangling**

![](/images/ad_4nxdvgup721g6p8ss0-eohyi4cjrayb2tnvsdsydfgbbhhclky7thetfqjf_3ap4yjqoftewkickoj2vg220h16tmilib-_3evubv7za2loycrmwhtre9jofhfwiu2z-a1k7zjzwbub91mavydx2h5zpt4u3z.png)

_A snapshot of the raw data._

Data wrangling and cleaning proved to be the most challenging and time consuming aspect of the project due to the following factors:

-   The provided raw dataset was “flipped”, with rows corresponding to individual attributes of one property, rather than to the property itself with corresponding columns.
-   There were many instances of irrelevant & unusable data, such as properties with multiple buildings, which skews results. 
-   Response data often consisted of a mixture of text, numbers, and arrays, rather than standardized responses from a finite list. 

The data was ultimately restructured by unique property ID, dropping impertinent features and reformatting unwieldy responses to streamline the EDA process. 

![](/images/ad_4nxf5eyhml005wy2zyrvkvipfk7zhif7akgka_lymuyy4ce2ybhjf6kaloshcbmgaqc0kqcqhnut_8tnpyzps17fmuw54cy0wxkdlejlempkzpq-py8cgwgxdthyynqjhrflarbssy7tm7zkingbrkle6gdzs.png)

_A snapshot of the cleaned dataframe._

Another dataset that was used in our analysis converted the zip codes in the raw data into regions in the country (northeast, midwest, southeast, southwest, and west). This was done to bin the zip codes into a meaningful format as a predictor.

# **4\. Overall Technical Approach**

The EDA process consisted of investigating hypotheses about structural attribute relationships that were provided by Partner. The table below outlines the different hypotheses and their corresponding correlation result.

![](/images/screenshot-202024-06-22-20133817.png)

_A table of Partner's hypotheses and the correlation results from initial investigations._

Greyed-out conclusions refer to inconclusive results due to there being too little data to perform correlation analysis (e.g. residential properties were too scarce in this dataset to make any valid statistical inferences). Yellow-colored conclusions refer to there being a very low correlation between attributes, but a strong indication that it does exist (i.e., low p-values). Note that although the p-values for such conclusions appear to be significant, it’s also important to consider its practicality. In other words, although the correlations appear to be significant, it may be due to there being a high volume of data, rather than because the relationships necessarily lead to impactful conclusions.
