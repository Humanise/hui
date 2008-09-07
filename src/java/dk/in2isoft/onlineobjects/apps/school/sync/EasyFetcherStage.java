package dk.in2isoft.onlineobjects.apps.school.sync;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import com.microsoft.sqlserver.jdbc.SQLServerDataSource;

import dk.in2isoft.onlineobjects.pipes.PipelineStageAdapter;

public class EasyFetcherStage extends PipelineStageAdapter {

	private String serverName; 
	private int portNumber; 
	private String databaseName; 
	private String user;
	private String password;
	private int maxRows;
	
	@Override
	public void run() {

		SQLServerDataSource ds = new SQLServerDataSource();
		ds.setUser(user);
		ds.setPassword(password);
		ds.setServerName(serverName);
		ds.setPortNumber(1433);
		ds.setDatabaseName(databaseName);
		Connection con = null;
		Statement stmt = null;
		ResultSet rs = null;
		try {
			context.info(this, "Opening connection");
			con = ds.getConnection();
			context.info(this, "Connection opened");
			String SQL = "SELECT * FROM [easy].[dbo].[elevskema] where DATO>DATEADD(day,-1,GETDATE()) and DATO<DATEADD(month,1,GETDATE()) order by SKEMABEG_ID desc,PERS_ID desc";
			stmt = con.createStatement();
			stmt.setMaxRows(maxRows);
			context.info(this, "Executing query");
			rs = stmt.executeQuery(SQL);
			context.info(this, "Query executed");
			context.info(this, "Iterating thru result");
			int num = 0;
			while (rs.next()) {
				num++;
				context.forwardResultSet(rs);
				if (num % 100 == 0) {
					context.info(this, "Iterated thru "+num+" rows");
				}
			}
			context.info(this, "Iteration finished, rows = "+num);
		} catch (SQLException e) {
			context.error(e);
		} finally {
			try {
				if (rs != null) {
					rs.close();
				}
				if (stmt != null) {
					stmt.close();
				}
				if (con != null) {
					con.close();
				}
			} catch (SQLException e) {
				context.error(e);
			}
		}
	}

	public String getServerName() {
		return serverName;
	}

	public void setServerName(String serverName) {
		this.serverName = serverName;
	}

	public int getPortNumber() {
		return portNumber;
	}

	public void setPortNumber(int portNumber) {
		this.portNumber = portNumber;
	}

	public String getDatabaseName() {
		return databaseName;
	}

	public void setDatabaseName(String databaseName) {
		this.databaseName = databaseName;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public int getMaxRows() {
		return maxRows;
	}

	public void setMaxRows(int maxRows) {
		this.maxRows = maxRows;
	}

}
