package dk.in2isoft.onlineobjects.apps.videosharing.views;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.InitializingBean;

import dk.in2isoft.onlineobjects.apps.community.jsf.AbstractManagedBean;
import dk.in2isoft.onlineobjects.apps.videosharing.util.MockUtil;

public class ChartsView extends AbstractManagedBean implements InitializingBean {
	
	private Map<String, List<ChartItemInfo>> charts;

	public void afterPropertiesSet() throws Exception {
		this.charts = MockUtil.buildChartsInGenres();
	}
	
	public Map<String, List<ChartItemInfo>> getCharts() {
		return charts;
	}
}
