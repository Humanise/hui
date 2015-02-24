package dk.in2isoft.onlineobjects.apps.videosharing.util;

import java.util.List;
import java.util.Map;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import dk.in2isoft.onlineobjects.apps.videosharing.views.ChartItemInfo;

public class MockUtil {

	private static String[] TITLES = new String[] {
		"Smooth Criminal"
		,"Poker Face"
		,"Like a Virgin"
		,"Everybody knows it's gonna..."
		,"Billy Jean"
		,"Be My Baby"
		,"Poker Face"
		,"Like a Virgin"
		,"Everybody knows it's gonna..."
		,"Billy Jean"};
	
	private static String[] GENRES = new String[] {
		"Alternative","Classical","Dance","Electronic","Hip-Hop/Rap","Jazz","Metal","Pop","R&B/Soul","Reggae","Rock","World"
	};
	
	public static List<ChartItemInfo> buildMockChart() {
		List<ChartItemInfo> list = Lists.newArrayList();
		for (int i = 0; i < 10; i++) {
			ChartItemInfo info = new ChartItemInfo();
			info.setUsername("jonasmunk");
			info.setPersonName("Kim Kurosawa");
			info.setRating((double)10-((double)i/(double)10));
			info.setTitle(TITLES[i]);
			info.setEvolution((i+1)%3-1);
			info.setNumber(i==9 ? "10" : "0"+(i+1));
			list.add(info);
		}
		return list;
	}
	
	public static Map<String,List<ChartItemInfo>> buildChartsInGenres() {
		Map<String,List<ChartItemInfo>> map = Maps.newLinkedHashMap();
		for (String genre : GENRES) {
			map.put(genre, buildMockChart());
		}
		return map;
	}
}
