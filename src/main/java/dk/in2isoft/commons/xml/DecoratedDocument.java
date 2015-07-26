package dk.in2isoft.commons.xml;

import java.io.IOException;
import java.io.StringReader;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import nu.xom.Attribute;
import nu.xom.Builder;
import nu.xom.Document;
import nu.xom.Element;
import nu.xom.Node;
import nu.xom.Nodes;
import nu.xom.ParentNode;
import nu.xom.ParsingException;
import nu.xom.Text;
import nu.xom.ValidityException;

import com.google.common.collect.Lists;
import com.google.common.collect.Sets;

import dk.in2isoft.commons.lang.Strings;

public class DecoratedDocument {

	//private Logger log = LoggerFactory.getLogger(DecoratedDocument.class);
	
	private static final Set<String> INLINES = Sets.newHashSet("b", "big", "i", "small", "tt","abbr", "acronym", "cite", "code", "dfn", "em", "kbd", "strong", "samp", "var","a", "bdo", "br", "img", "map", "object", "q", "script", "span", "sub", "sup");

	private String text;
	private Document document;
	private List<Fragment> fragments;
	private List<Decoration> decorations;
	private boolean built;
	
	public DecoratedDocument(Document document) {
		this.document = document;
		this.fragments = Lists.newArrayList();
		this.decorations = Lists.newArrayList();
	}
	
	private void buildText() {
		if (built) {
			return;
		}
		
		StringBuilder allText = new StringBuilder();
		int pos = 0;
		Nodes nodes = document.getRootElement().query("//text()");
		for (int i = 0; i < nodes.size(); i++) {
			Text node = (Text) nodes.get(i);
			if (i>0) {
				boolean newLine = isNewline(node);
				
				if (newLine) {
					allText.append("\n\n");
					pos+=2;
				}
			}
			
			
			Fragment fragment = new Fragment();
			fragment.node = node;
			fragment.from = pos;
			String str = node.getValue();
			pos+=str.length();
			fragment.to = pos;
			fragments.add(fragment);
			allText.append(str);
		}
		this.text = allText.toString();
		//log.info("Fragments: "+fragments);
	}

	private boolean isNewline(Node node) {
		Node previous = getPrevious(node);
		if (previous!=null) {
			if (previous instanceof Text) {
				return false;
			} else if (previous instanceof Element) {
				Element element = (Element) previous;
				return !isInline(element);
			}
		}
		ParentNode parent = node.getParent();
		if (parent==null) {
			return false;
		}
		if (!isInline(parent)) {
			return true;
		} else {
			return isNewline(parent);
		}
	}

	private boolean isInline(Node node) {
		if (node instanceof Element) {
			Element element = (Element) node;
			return INLINES.contains(element.getLocalName().toLowerCase());
		}
		return false;
	}
	
	private Node getPrevious(Node node) {
		ParentNode parent = node.getParent();
		int count = parent.getChildCount();
		for (int i = 1; i < count; i++) {
			if (parent.getChild(i).equals(node)) {
				return parent.getChild(i-1);
			}
		}
		return null;
	}

	public void build() {
		decorations.sort((o1, o2) -> {
			int diff = o1.from - o2.from;
			return diff==0 ? 0 : diff > 0 ? 1 : -1;
		});
		for (Fragment fragment : fragments) {
			int from = fragment.from;
			int to = fragment.to;
			//log.info(to + " vs " + fragment.to );
			List<Decoration> localDecorations = Lists.newArrayList(); 
			for (Decoration decoration : decorations) {
				if (decoration.from > to || decoration.to < from) {
					continue;
				}
				Decoration subDecoration = new Decoration();
				subDecoration.from = Math.max(from, decoration.from) - from;
				subDecoration.to = Math.min(to, decoration.to) - from;
				subDecoration.tag = decoration.tag;
				subDecoration.attributes = decoration.attributes;
				localDecorations.add(subDecoration);
			}
			buildReplacement(fragment, localDecorations);
		}
		for (Fragment fragment : fragments) {
			Text node = fragment.node;
			ParentNode parent = node.getParent();
			int index = parent.indexOf(node);
			int count = fragment.replacement.size();
			for (int i = count-1; i >= 0; i--) {
				parent.insertChild(fragment.replacement.get(i), index+1);
			}
			parent.removeChild(index);
		}
	}
	
	private void buildReplacement(Fragment fragment, List<Decoration> decorations) {
		String text = fragment.node.getValue();
		Set<Integer> breaks = Sets.newHashSet(0,text.length());
		
		for (Decoration decoration : decorations) {
			breaks.add(decoration.from);
			breaks.add(decoration.to);
		}
		List<Integer> ordered = Lists.newArrayList(breaks);
		ordered.sort(null);
		
		List<Part> parts = Lists.newArrayList();
		int cur = ordered.remove(0);
		for (Integer point : ordered) {
			Part part = new Part();
			part.text = text.substring(cur,point);
			for (Decoration decoration : decorations) {
				if (decoration.from<=cur && decoration.to>=point) {
					part.decorations.add(decoration);
				}
			}
			parts.add(part);			
			cur = point;
		}
		
		fragment.replacement = convert(parts);
	}
	
	private Nodes convert(List<Part> parts) {
		Nodes replacement = new Nodes();
		for (Part part : parts) {
			Node cur = new Text(part.text);
			for (Decoration decoration : part.decorations) {
				Element wrapper = new Element(decoration.tag);
				if (decoration.attributes!=null) {
					decoration.attributes.entrySet().forEach((Entry<String,Object> entry) -> {
						Object value = entry.getValue();
						if (value!=null) {
							wrapper.addAttribute(new Attribute(entry.getKey(), value.toString()));
						}
					});
				}
				wrapper.appendChild(cur);
				cur = wrapper;
			}
			replacement.append(cur);
		}
		return replacement;
	}
	
	public void decorate(int from, int to, String tag) {
		decorate(from, to, tag, null);
	}

	public void decorate(int from, int to, String tag, Map<String,Object> attributes) {
		Decoration decoration = new Decoration();
		decoration.from = from;
		decoration.to = to;
		decoration.tag = tag;
		decoration.attributes = attributes;
		decorations.add(decoration);
	}
	
	public String getText() {
		this.buildText();
		return text;
	}
	
	public Document getDocument() {
		return document;
	}
	
	public static DecoratedDocument parse(String xml) throws ValidityException, ParsingException, IOException {
		Builder builder = new Builder();
		try (StringReader reader = new StringReader(xml)) {
			Document document = builder.build(reader);
			DecoratedDocument decorated = new DecoratedDocument(document);
			return decorated;
		}
	}
	
	private class Fragment {
		Text node;
		Nodes replacement;
		int from;
		int to;
		
		@Override
		public String toString() {
			return "[" + from + " " + Strings.RIGHTWARDS_ARROW + " " + to + "]"; 
		}
	}
	
	private class Decoration {
		public Map<String, Object> attributes;
		int from;
		int to;
		String tag;
	}
	
	private class Part {
		String text;
		List<Decoration> decorations = Lists.newArrayList();
		@Override
		public String toString() {
			StringBuilder str = new StringBuilder();
			for (Decoration decoration : decorations) {
				str.append("<" + decoration.tag + ">");
			}
			str.append(text);
			for (Decoration decoration : decorations) {
				str.append("</" + decoration.tag + ">");
			}
			return str.toString();
		}
	}
}
