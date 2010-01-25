package dk.in2isoft.onlineobjects.test.traffic;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

import com.google.gdata.client.analytics.AnalyticsService;
import com.google.gdata.client.analytics.DataQuery;
import com.google.gdata.data.analytics.AccountEntry;
import com.google.gdata.data.analytics.AccountFeed;
import com.google.gdata.data.analytics.Aggregates;
import com.google.gdata.data.analytics.DataEntry;
import com.google.gdata.data.analytics.DataFeed;
import com.google.gdata.data.analytics.DataSource;
import com.google.gdata.data.analytics.Dimension;
import com.google.gdata.data.analytics.Metric;
import com.google.gdata.util.ServiceException;

import dk.in2isoft.onlineobjects.test.AbstractTestCase;

public class TestAnalytics extends AbstractTestCase {

	@Test
	public void testSimpleMail() throws IOException, ServiceException {
		String baseUrl = "https://www.google.com/analytics/feeds/data";
		URL url = new URL(baseUrl);
		AnalyticsService as = new AnalyticsService("gaExportAPI_acctSample_v1.0");
		as.setUserCredentials(getProperty("analytics.username"), getProperty("analytics.password"));
		
		AccountFeed accountFeed =  as.getFeed(new URL("https://www.google.com/analytics/feeds/accounts/default"), AccountFeed.class);


	    //------------------------------------------------------
	    // Format Feed Related Data
	    //------------------------------------------------------
	    // Print top-level information about the feed
	    System.out.println(
	      "\nFeed Title     = " + accountFeed.getTitle().getPlainText() + 
	      "\nTotal Results  = " + accountFeed.getTotalResults() +
	      "\nStart Index    = " + accountFeed.getStartIndex() +
	      "\nItems Per Page = " + accountFeed.getItemsPerPage() +
	      "\nFeed Id        = " + accountFeed.getId());

	    // Print the feeds' entry data
	    for (AccountEntry entry : accountFeed.getEntries()) {
	      System.out.println(
	        "\nWeb Property Id = " + entry.getProperty("ga:webPropertyId") +
	        "\nAccount Name    = " + entry.getProperty("ga:accountName") +
	        "\nAccount Id      = " + entry.getProperty("ga:accountId") +
	        "\nProfile Name    = " + entry.getTitle().getPlainText() +
	        "\nProfile Id      = " + entry.getProperty("ga:profileId") +
	        "\nTable Id        = " + entry.getTableId().getValue());
	    }
	    
	    System.out.println("====================================");
	    
		DataQuery query = new DataQuery(url);
		query.setIds("ga:"+getProperty("analytics.id"));
		query.setDimensions("ga:pageTitle");
		query.setMetrics("ga:pageviews");
		query.setSort("-ga:pageviews");
		//query.setFilters("ga:medium==referral");
		query.setMaxResults(100);
		query.setStartDate("2007-01-01");
		query.setEndDate("2009-12-31");
		System.out.println("URL: " + query.getUrl().toString());

	    // Send our request to the Analytics API and wait for the results to come back
	    DataFeed feed = as.getFeed(query, DataFeed.class);
	    
	    outputFeedData(feed);
	    outputFeedDataSources(feed);
	    outputFeedAggregates(feed);
	    outputEntryRowData(feed);

	    String tableData = getFeedTable(feed);
	    System.out.println(tableData);
	}
	

	  //------------------------------------------------------
	  // Format Feed Related Data
	  //------------------------------------------------------
	  /**
	   * Output the information specific to the feed.
	   * @param {DataFeed} feed Parameter passed
	   *     back from the feed handler.
	   */
	  public static void outputFeedData(DataFeed feed) {
	    System.out.println(
	      "\nFeed Title      = " + feed.getTitle().getPlainText() +
	      "\nFeed ID         = " + feed.getId() +
	      "\nTotal Results   = " + feed.getTotalResults() +
	      "\nSart Index      = " + feed.getStartIndex() +
	      "\nItems Per Page  = " + feed.getItemsPerPage() +
	      "\nStart Date      = " + feed.getStartDate().getValue() +
	      "\nEnd Date        = " + feed.getEndDate().getValue());
	  }

	  /**
	  * Output information about the data sources in the feed.
	  * Note: the GA Export API currently has exactly one data source.
	  * @param {DataFeed} feed Parameter passed
	  *     back from the feed handler.
	  */
	  public static void outputFeedDataSources(DataFeed feed) {
	    DataSource gaDataSource = feed.getDataSources().get(0);
	    System.out.println(
	      "\nTable Name      = " + gaDataSource.getTableName().getValue() +
	      "\nTable ID        = " + gaDataSource.getTableId().getValue() +
	      "\nWeb Property Id = " + gaDataSource.getProperty("ga:webPropertyId") +
	      "\nProfile Id      = " + gaDataSource.getProperty("ga:profileId") +
	      "\nAccount Name    = " + gaDataSource.getProperty("ga:accountName"));
	  }

	  /**
	  * Output all the metric names and values of the aggregate data.
	  * The aggregate metrics represent values across all of the entries selected 
	  *     by the query and not just the rows returned.
	  * @param {DataFeed} feed Parameter passed
	  *     back from the feed handler.
	  */
	  public static void outputFeedAggregates(DataFeed feed) {  
	    Aggregates aggregates = feed.getAggregates();
	    List<Metric> aggregateMetrics = aggregates.getMetrics();
	    for (Metric metric : aggregateMetrics) {
	      System.out.println(
	        "\nMetric Name  = " + metric.getName() +
	        "\nMetric Value = " + metric.getValue() +
	        "\nMetric Type  = " + metric.getType() +
	        "\nMetric CI    = " + metric.getConfidenceInterval().toString());
	    }
	  }

	  /**
	   * Output all the important information from the first entry in the data feed.
	   * @param {DataFeed} feed Parameter passed
	   *     back from the feed handler.
	   */
	  public static void outputEntryRowData(DataFeed feed) {
	    List<DataEntry> entries = feed.getEntries();
	    if (entries.size() == 0) {
	      System.out.println("No entries found");
	      return;
	    }
	    DataEntry singleEntry = entries.get(0);

	    // properties specific to all the entries returned in the feed
	    System.out.println("Entry ID    = " + singleEntry.getId());
	    System.out.println("Entry Title = " + singleEntry.getTitle().getPlainText());

	    // iterate through all the dimensions
	    List<Dimension> dimensions = singleEntry.getDimensions();
	    for (Dimension dimension : dimensions) {
	      System.out.println("Dimension Name  = " + dimension.getName());
	      System.out.println("Dimension Value = " + dimension.getValue());
	    }

	    // iterate through all the metrics
	    List<Metric> metrics = singleEntry.getMetrics();
	    for (Metric metric : metrics) {
	      System.out.println("Metric Name  = " + metric.getName());
	      System.out.println("Metric Value = " + metric.getValue());
	      System.out.println("Metric Type  = " + metric.getType());
	      System.out.println("Metric CI    = " + metric.getConfidenceInterval().toString());
	    }
	  }

	  /**
	   * Get the data feed values in the feed as a string.
	   * @param {DataFeed} feed Parameter passed
	   *     back from the feed handler.
	   * @return {String} This returns the contents of the feed.
	   */
	  public static String getFeedTable(DataFeed feed) {
	    List<DataEntry> entries = feed.getEntries();
	    if (entries.size() == 0) {
	      return "No entries found";
	    }
	    DataEntry singleEntry = entries.get(0);
	    List<Dimension> dimensions = singleEntry.getDimensions();
	    List<Metric> metrics = singleEntry.getMetrics();
	    List<String> feedDataNames = new ArrayList<String>();
	    String feedDataValues = "";

	    // put all the dimension and metric names into an array
	    for (Dimension dimension : dimensions) {
	      feedDataNames.add(dimension.getName());
	    }
	    for (Metric metric : metrics) {
	      feedDataNames.add(metric.getName());
	    }

	    // put the values of the dimension and metric names into the table
	    for (DataEntry entry : entries) {
	      for (String dataName : feedDataNames) {
	        feedDataValues += "\n" + dataName + "\t= " + entry.stringValueOf(dataName);
	      }
	      feedDataValues += "\n";
	    }
	    return feedDataValues;
	  }
}
