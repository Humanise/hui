package dk.in2isoft.in2igui.data;

import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.google.common.collect.Lists;

public class Diagram {

	private List<Node> nodes = Lists.newArrayList();
	private List<Edge> edges = Lists.newArrayList();
	
	private int maxNodeCount = Integer.MAX_VALUE;

	public List<Node> getNodes() {
		return nodes;
	}

	public void setNodes(List<Node> nodes) {
		this.nodes = nodes;
	}

	public List<Edge> getEdges() {
		return edges;
	}

	public void setEdges(List<Edge> edges) {
		this.edges = edges;
	}

	public void addNode(Node node) {
		for (Node existing : nodes) {
			if (StringUtils.equals(node.getId(), existing.getId())) {
				return;
			}
		}
		nodes.add(node);
	}

	public void addEdge(Node from, Node to) {
		if (from.getId().equals(to.getId())) {
			System.out.println(from+" -> "+to);
		}
		edges.add(new Edge(from.getId(), to.getId()));
	}

	public void addEdge(Node from, String label, Node to) {
		edges.add(new Edge(from.getId(), label, to.getId()));
	}

	public int getMaxNodeCount() {
		return maxNodeCount;
	}

	public void setMaxNodeCount(int maxNodes) {
		this.maxNodeCount = maxNodes;
	}
	
	public boolean isFull() {
		return nodes.size() >= maxNodeCount;
	}

}
