package dk.in2isoft.onlineobjects.modules.organic;

import java.util.List;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.Lists;
import com.google.common.collect.Multimap;

public class Environment implements HeartBeating {
	
	private List<HeartBeating> beating;
	
	private Multimap<String,String> scents;
	
	private List<Cell> cells;
	
	public Environment() {
		beating = Lists.newArrayList();
		cells = Lists.newArrayList();
		scents = HashMultimap.create();
	}

	public void beat() {
		for (HeartBeating thing : beating) {
			thing.beat();
		}
	}
	
	public void addCell(Cell cell) {
		cells.add(cell);
		beating.add(cell);
	}
}
