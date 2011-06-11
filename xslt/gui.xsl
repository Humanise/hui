<?xml version="1.0"?>
<xsl:stylesheet
	xmlns="http://www.w3.org/1999/xhtml"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:gui="uri:hui"
	xmlns:html="http://www.w3.org/1999/xhtml"
    version="1.0"
    exclude-result-prefixes="gui"
    >

<!--xsl:include href="iphone.xsl"/-->
<xsl:include href="layout.xsl"/>
<xsl:include href="formula.xsl"/>
<!--xsl:include href="view.xsl"/--> <!-- TODO: remove this -->
<xsl:include href="toolbar.xsl"/>
<xsl:include href="links.xsl"/>
<xsl:include href="other.xsl"/>

<xsl:output encoding="UTF-8" omit-xml-declaration="yes" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>

<xsl:template match="gui:gui">
<html class="hui">

<head>
	<xsl:if test="$profile='true'">
	<script>
		console.profile();
		window.setTimeout(function() {console.profileEnd()},5000);
	</script>
	</xsl:if>
	<title><xsl:value-of select="@title"/></title>
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<xsl:choose>
	<xsl:when test="$dev='true'">
		<link rel="stylesheet" href="{$context}/hui/css/dev.css?version={$version}" type="text/css" media="screen" title="no title" charset="utf-8"/>
	</xsl:when>
	<xsl:otherwise>
		<link rel="stylesheet" href="{$context}/hui/bin/minimized.css?version={$version}" type="text/css" media="screen" title="no title" charset="utf-8"/>
	</xsl:otherwise>
</xsl:choose>
<!--
<xsl:comment><![CDATA[[if lt IE 8]>
	<script src="]]><xsl:value-of select="$context"/><![CDATA[/hui/lib/IE8.js" type="text/javascript"></script>
<![endif]]]></xsl:comment>-->
<xsl:comment><![CDATA[[if IE 8]>
	<link rel="stylesheet" type="text/css" href="]]><xsl:value-of select="$context"/><![CDATA[/hui/css/msie8.css?version=]]><xsl:value-of select="$version"/><![CDATA["> </link>
<![endif]]]></xsl:comment>
<xsl:comment><![CDATA[[if lt IE 7]>
	<link rel="stylesheet" type="text/css" href="]]><xsl:value-of select="$context"/><![CDATA[/hui/css/msie6.css?version=]]><xsl:value-of select="$version"/><![CDATA["> </link>
<![endif]]]></xsl:comment>
<xsl:comment><![CDATA[[if IE 7]>
	<link rel="stylesheet" type="text/css" href="]]><xsl:value-of select="$context"/><![CDATA[/hui/css/msie7.css?version=]]><xsl:value-of select="$version"/><![CDATA["> </link>
<![endif]]]></xsl:comment>
<xsl:for-each select="//gui:css">
	<link rel="stylesheet" href="{@url}" type="text/css" media="screen" title="no title" charset="utf-8"/>
</xsl:for-each>
<xsl:choose>
	<xsl:when test="$dev='true'">
		<script src="{$context}/hui/lib/swfupload/swfupload.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/lib/date.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/lib/json2.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/hui.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/ui.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/hui_require.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/Source.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/DragDrop.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/Window.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/Formula.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/List.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/Tabs.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/ObjectList.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/Alert.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/Button.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/Selection.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/Toolbar.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/ImagePicker.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/BoundPanel.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/RichText.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/Picker.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/ImageViewer.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/ColorPicker.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/Upload.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/ProgressBar.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/Gallery.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/Calendar.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/DatePicker.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/Layout.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/Dock.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/Box.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/Wizard.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/Articles.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/Input.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/SearchField.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/Overflow.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/Fragment.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/Bar.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/IFrame.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/Segmented.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/Flash.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/Overlay.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/Links.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/Link.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/LocationField.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/DropDown.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/StyleLength.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/hui/js/DateTimeField.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
	</xsl:when>
	<xsl:otherwise>
		<script src="{$context}/hui/bin/minimized.js?version={$version}" type="text/javascript" charset="utf-8"><xsl:comment/></script>
	</xsl:otherwise>
</xsl:choose>
<xsl:if test="//gui:graph">
	<link rel="stylesheet" href="{$context}/hui/ext/graph.css?version={$version}" type="text/css" media="screen" title="no title" charset="utf-8"/>
	<script type="text/javascript" src="{$context}/hui/lib/protovis-3.2/protovis-r3.2.js"><xsl:comment/></script>
	<script type="text/javascript" src="{$context}/hui/lib/raphael-min.js"><xsl:comment/></script>
	<script src="{$context}/hui/ext/Graph.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
</xsl:if>
<xsl:for-each select="gui:localize[@source]">
	<script src="{@source}" type="text/javascript" charset="utf-8"><xsl:comment/></script>
</xsl:for-each>
<xsl:for-each select="gui:controller[@source]">
	<script src="{@source}" type="text/javascript" charset="utf-8"><xsl:comment/></script>
</xsl:for-each>
<script type="text/javascript">
	hui.ui.context = '<xsl:value-of select="$context"/>';
	<xsl:if test="@state">
		hui.ui.state = '<xsl:value-of select="@state"/>';
	</xsl:if>
	<xsl:if test="$language">
		hui.ui.language = '<xsl:value-of select="$language"/>';
	</xsl:if>
	<xsl:for-each select="gui:controller[@source]">
		<xsl:if test="@name">
		if (window['<xsl:value-of select="@name"/>']!==undefined) {
			hui.ui.listen(<xsl:value-of select="@name"/>);
		}
		</xsl:if>
	</xsl:for-each>
</script>
<xsl:call-template name="dwr-setup"/>
</head>
<body class="hui">
	<xsl:choose>
		<xsl:when test="@padding"><div style="padding: {@padding}px;" class="hui_body"><xsl:apply-templates/></div></xsl:when>
		<xsl:otherwise><xsl:apply-templates/></xsl:otherwise>
	</xsl:choose>
</body>
</html>
</xsl:template>

<xsl:template name="dwr-setup">
	<xsl:if test="gui:dwr">
		<script src="{$context}{gui:dwr/@base}engine.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<xsl:for-each select="gui:dwr/gui:interface">
			<script src="{$context}{../@base}interface/{@name}.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		</xsl:for-each>
		<script type="text/javascript">
			dwr.engine.setErrorHandler(hui.ui.dwrErrorHandler);
		</script>
	</xsl:if>
</xsl:template>

<xsl:template name="gui:createobject">
	<xsl:if test="@name and @name!=''">
		if (window['<xsl:value-of select="@name"/>']===undefined) {
			window['<xsl:value-of select="@name"/>'] = <xsl:value-of select="generate-id()"/>_obj;
		}
	</xsl:if>
</xsl:template>

<xsl:template name="gui:escapeScript">
	<xsl:param name="text"/>
	<xsl:choose>
		<xsl:when test='contains($text,"&apos;")'>
			<xsl:value-of select='substring-before($text,"&apos;")'/>
			<xsl:value-of select='"\&apos;"'/>
			<xsl:call-template name="gui:escapeScript">
				<xsl:with-param name="text" select='substring-after($text,"&apos;")'/>
			</xsl:call-template>
		</xsl:when>
		<xsl:otherwise>
			<xsl:value-of select="$text"/>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<xsl:template match="gui:source">
<script type="text/javascript">
	var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Source({name:'<xsl:value-of select="@name"/>'
		<xsl:choose>
			<xsl:when test="@url">,url:'<xsl:value-of select="@url"/>'</xsl:when>
			<xsl:when test="@dwr">,dwr:'<xsl:value-of select="@dwr"/>'</xsl:when>
		</xsl:choose>
		<xsl:if test="@lazy='true'">,lazy:true</xsl:if>
	});
	<xsl:call-template name="gui:createobject"/>
	with (<xsl:value-of select="generate-id()"/>_obj) {
		<xsl:for-each select="gui:parameter">
			addParameter({key:'<xsl:value-of select="@key"/>',value:'<xsl:value-of select="@value"/>'})
		</xsl:for-each>
	}
</script>
</xsl:template>

<xsl:template name="gui:subgui">
	<div>
		<xsl:apply-templates/>
	</div>
</xsl:template>

<xsl:template match="gui:script">
	<script type="text/javascript">
		<xsl:apply-templates/>
	</script>
</xsl:template>

<xsl:template match="gui:listen">
	<script type="text/javascript">
		(function() {
			var listener = {};
			<xsl:for-each select="*">
				listener['$<xsl:value-of select="local-name()"/>$<xsl:value-of select="../@for"/>']=function() {<xsl:apply-templates/>};
			</xsl:for-each>
			hui.ui.listen(listener);
	
		})()
	</script>	
</xsl:template>

<xsl:template match="gui:dock">
	<table class="hui_dock" id="{generate-id()}">
		<xsl:if test="@position='top' or not(@position)">
			<thead>
				<tr><td>
					<xsl:apply-templates/>
				</td></tr>
			</thead>
		</xsl:if>
		<xsl:if test="@position='bottom'">
			<tfoot>
				<xsl:if test="gui:tabs"><xsl:attribute name="class">hui_dock_tabs</xsl:attribute></xsl:if>
				<tr><td>
					<xsl:apply-templates/>
				</td></tr>
			</tfoot>
		</xsl:if>
		<tbody>
			<tr><td>
				<div class="hui_dock_progress"><xsl:comment/></div>
				<iframe src="{@url}" frameborder="0" name="{@frame-name}"/>
			</td></tr>
		</tbody>
	</table>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Dock({element:'<xsl:value-of select="generate-id()"/>',name:'<xsl:value-of select="@name"/>'<xsl:if test="gui:tabs">,tabs:true</xsl:if>});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:frames">
	<html>
		<head>
		</head>
		<frameset rows="84,*" framespacing="0" frameborder="0" border="0">
			<xsl:for-each select="gui:frame">
				<frame noresize="noresize" src="{@source}" name="{@name}" frameborder="0" marginheight="0" marginwidth="0" border="0">
					<xsl:attribute name="scrolling">
						<xsl:choose>
							<xsl:when test="@scrolling='false'">no</xsl:when>
							<xsl:otherwise>auto</xsl:otherwise>
						</xsl:choose>
					</xsl:attribute>
				</frame>
			</xsl:for-each>
		</frameset>
	</html>
</xsl:template>

<xsl:template match="gui:iframe">
	<xsl:variable name="id">
		<xsl:choose>
			<xsl:when test="@id"><xsl:value-of select="@id"/></xsl:when>
			<xsl:otherwise><xsl:value-of select="generate-id()"/></xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<iframe id="{$id}" name="{$id}" src="{@source}" frameborder="0">
		<xsl:attribute name="style">
			<xsl:text>width: 100%; background: #fff; display: block;</xsl:text>
			<xsl:choose>
				<xsl:when test="@height"><xsl:text>height: </xsl:text><xsl:value-of select="@height"/><xsl:text>px;</xsl:text></xsl:when>
				<xsl:otherwise>height: 100%;</xsl:otherwise>
			</xsl:choose>
			<xsl:if test="@border='true'">
				<xsl:text>border: 1px solid #ddd; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box;</xsl:text>
			</xsl:if>
		</xsl:attribute>
		<xsl:comment/>
	</iframe>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.IFrame({
			element:'<xsl:value-of select="$id"/>',
			name:'<xsl:value-of select="@name"/>'
			<xsl:if test="@state">
				,state:'<xsl:value-of select="@state"/>'
			</xsl:if>
		});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>
	

<xsl:template match="gui:selection">
	<div class="hui_selection" id="{generate-id()}"><xsl:apply-templates/></div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Selection({
			element:'<xsl:value-of select="generate-id()"/>',name:'<xsl:value-of select="@name"/>'
			<xsl:if test="@value">,value:'<xsl:value-of select="@value"/>'</xsl:if>
		});
		with (<xsl:value-of select="generate-id()"/>_obj) {
			<xsl:for-each select="gui:item">
				registerItem('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@title"/>','<xsl:value-of select="@icon"/>','<xsl:value-of select="@badge"/>','<xsl:value-of select="@value"/>','<xsl:value-of select="@kind"/>');
			</xsl:for-each>
			<xsl:for-each select="gui:source">
				registerSource(<xsl:value-of select="generate-id()"/>_obj);
			</xsl:for-each>
			<xsl:for-each select="gui:items">
				registerItems(<xsl:value-of select="generate-id()"/>_obj);
			</xsl:for-each>
		}
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:selection/gui:item">
	<div id="{generate-id()}">
		<xsl:attribute name="class">hui_selection_item<xsl:if test="@value=../@value"> hui_selected</xsl:if></xsl:attribute>
		<xsl:if test="@badge"><strong class="hui_selection_badge"><xsl:value-of select="@badge"/></strong></xsl:if>
		<xsl:if test="@icon">
			<span>
				<xsl:attribute name="style">background-image: url('<xsl:value-of select="$context"/>/hui/icons/<xsl:value-of select="@icon"/>1.png');</xsl:attribute>
				<xsl:attribute name="class">hui_icon_1</xsl:attribute>
				<xsl:comment/>
			</span>
		</xsl:if>
		<span class="hui_selection_label">
		<xsl:value-of select="@title"/>
		</span>
	</div>
</xsl:template>

<xsl:template match="gui:selection/gui:items">
	<xsl:if test="@title">
		<div class="hui_selection_title" id="{generate-id()}_title" style="display: none;"><span><xsl:value-of select="@title"/></span></div>
	</xsl:if>
	<div id="{generate-id()}">
		<xsl:comment/>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Selection.Items({
			element:'<xsl:value-of select="generate-id()"/>'
			,name:'<xsl:value-of select="@name"/>'
			<xsl:if test="@source">,source:<xsl:value-of select="@source"/></xsl:if>
		});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:selection/gui:source">
	<div id="{generate-id()}">
		<xsl:comment/>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Selection.Source('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>',{url:'<xsl:value-of select="@url"/>'});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:selection/gui:title">
	<div class="hui_selection_title"><span><xsl:value-of select="."/></span></div>
</xsl:template>

<!--             List            -->

<xsl:template match="gui:list">
	<div class="hui_list" id="{generate-id()}">
		<xsl:if test="@state and (not(//gui:gui/@state) or @state!=//gui:gui/@state)">
			<xsl:attribute name="style">display:none</xsl:attribute>
		</xsl:if>
		<div class="hui_list_progress"></div>
		<div class="hui_list_navigation">
			<div class="hui_list_selection window_page"><div><div class="window_page_body"><xsl:comment/></div></div></div>
			<span class="hui_list_count"><xsl:comment/></span>
		</div>
		<div class="hui_list_body">
			<table cellspacing="0" cellpadding="0">
				<thead>
					<tr>
					<xsl:apply-templates select="gui:column"/>
					</tr>
				</thead>
				<tbody><xsl:comment/></tbody>
			</table>
		</div>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.List({
			element:'<xsl:value-of select="generate-id()"/>',
			name:'<xsl:value-of select="@name"/>',
			url:'<xsl:value-of select="@url"/>',
			<xsl:if test="@source">source:<xsl:value-of select="@source"/>,</xsl:if>
			state:'<xsl:value-of select="@state"/>',
			windowSize:'<xsl:value-of select="gui:window/@size"/>'
		});
		with (<xsl:value-of select="generate-id()"/>_obj) {
			<xsl:for-each select="gui:column">
				registerColumn({key:'<xsl:value-of select="@key"/>',title:'<xsl:value-of select="@title"/>'});
			</xsl:for-each>
		}
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:list/gui:window"></xsl:template>

<xsl:template match="gui:column">
	<th>
		<xsl:if test="@width='min'">
			<xsl:attribute name="style">width: 1%;</xsl:attribute>
		</xsl:if>
		<xsl:value-of select="@title"/>
	</th>
</xsl:template>

<!--                             Tabs                             -->

<xsl:template match="gui:tabs">
<div id="{generate-id()}" class="hui_tabs">
	<xsl:if test="@below='true'">
		<xsl:apply-templates select="gui:tab"/>
	</xsl:if>
	<div>
		<xsl:attribute name="class">
			<xsl:text>hui_tabs_bar</xsl:text>
			<xsl:choose>
				<xsl:when test="@small='true' and @below='true'">
					<xsl:text> hui_tabs_bar_small_below</xsl:text>
				</xsl:when>
				<xsl:when test="@small='true'">
					<xsl:text> hui_tabs_bar_small</xsl:text>
				</xsl:when>
			</xsl:choose>
			<xsl:if test="@centered='true'">
				<xsl:text> hui_tabs_bar_centered</xsl:text>
			</xsl:if>
		</xsl:attribute>
		<ul>
		<xsl:for-each select="gui:tab">
			<li id="{generate-id()}_tab">
				<xsl:if test="position()=1">
					<xsl:attribute name="class">hui_tabs_selected</xsl:attribute>
				</xsl:if>
				<a href="javascript:void(0)"><span><span><xsl:value-of select="@title"/></span></span></a>
			</li>
		</xsl:for-each>
		</ul>
	</div>
	<xsl:if test="not(@below='true')">
		<xsl:apply-templates select="gui:tab"/>
	</xsl:if>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Tabs({element:'<xsl:value-of select="generate-id()"/>',name:'<xsl:value-of select="@name"/>'});
		<xsl:call-template name="gui:createobject"/>
	</script>
</div>
</xsl:template>

<xsl:template match="gui:tabs/gui:tab">
	<div class="" id="{generate-id()}">
		<xsl:attribute name="class">
			<xsl:choose>
				<xsl:when test="@background='light'"><xsl:text>hui_tabs_tab hui_tabs_tab_light</xsl:text></xsl:when>
				<xsl:otherwise><xsl:text>hui_tabs_tab</xsl:text></xsl:otherwise>
			</xsl:choose>
		</xsl:attribute>
		<xsl:attribute name="style">
			<xsl:if test="position()>1">display: none;</xsl:if>
			<xsl:if test="@padding">padding: <xsl:value-of select="@padding"/>px;</xsl:if>
		</xsl:attribute>
		<xsl:apply-templates/>
	</div>
</xsl:template>


<!-- Bound panel -->

<xsl:template match="gui:boundpanel">
	<div id="{generate-id()}" class="hui_boundpanel" style="display:none;">
		<div class="hui_boundpanel_arrow"><xsl:comment/></div>
		<div class="hui_boundpanel_top"><div><div><xsl:comment/></div></div></div>
		<div class="hui_boundpanel_body">
			<div class="hui_boundpanel_body">
				<div class="hui_boundpanel_body">
					<div class="hui_boundpanel_content">
						<xsl:attribute name="style">
							<xsl:if test="@width">width:<xsl:value-of select="@width"/>px;</xsl:if>
							<xsl:if test="@padding">padding:<xsl:value-of select="@padding"/>px;</xsl:if>
						</xsl:attribute>
						<xsl:apply-templates/>
						<xsl:comment/>
					</div>
				</div>
			</div>
		</div>
		<div class="hui_boundpanel_bottom"><div><div><xsl:comment/></div></div></div>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.BoundPanel({
			element:'<xsl:value-of select="generate-id()"/>',
			name:'<xsl:value-of select="@name"/>'
			<xsl:if test="@target">,target:'<xsl:value-of select="@target"/>'</xsl:if>
		});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<!-- Window -->

<xsl:template match="gui:window">
	<div id="{generate-id()}">
		<xsl:attribute name="class">
			<xsl:text>hui_window</xsl:text>
			<xsl:if test="@variant"><xsl:text> hui_window_</xsl:text><xsl:value-of select="@variant"/></xsl:if>
		</xsl:attribute>
		<xsl:apply-templates select="gui:back"/>
		<div class="hui_window_front">
			<xsl:if test="not(@close='false')">
				<div class="hui_window_close"><xsl:comment/></div>
			</xsl:if>
			<div class="hui_window_titlebar"><div><div>
				<xsl:if test="@icon">
					<span class="hui_window_icon" style="background-image: url('{$context}/hui/icons/{@icon}1.png')"></span>
				</xsl:if>
				<span class="hui_window_title"><xsl:value-of select="@title"/></span>
			</div></div></div>
			<div class="hui_window_content"><div class="hui_window_content"><div class="hui_window_body">
	 			<xsl:attribute name="style"><xsl:if test="@width">width: <xsl:value-of select="@width"/>px;</xsl:if><xsl:if test="@padding">padding: <xsl:value-of select="@padding"/>px;</xsl:if></xsl:attribute>
				<xsl:apply-templates select="child::*[not(name()='back')]"/>
			</div></div></div>
			<div class="hui_window_bottom"><div class="hui_window_bottom"><div class="hui_window_bottom"><xsl:comment/></div></div></div>
		</div>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Window({element:'<xsl:value-of select="generate-id()"/>',name:'<xsl:value-of select="@name"/>'});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:window/gui:back">
	<div class="hui_window_back">
		<xsl:apply-templates/>
		<xsl:comment/>
	</div>
</xsl:template>
<!-- Upload -->

<xsl:template match="gui:upload">
	<div class="hui_upload" id="{generate-id()}">
		<div class="hui_upload_items"><xsl:comment/></div>
		<div class="hui_upload_status"><xsl:comment/></div>
		<xsl:apply-templates/>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Upload({
			element:'<xsl:value-of select="generate-id()"/>',
			name:'<xsl:value-of select="@name"/>',
			url:'<xsl:value-of select="@url"/>',
			button:'<xsl:value-of select="@button"/>'
			<xsl:if test="@flash">,useFlash:<xsl:value-of select="@flash='true'"/></xsl:if>
			<xsl:if test="@chooseButton">,chooseButton:'<xsl:value-of select="@chooseButton"/>'</xsl:if>
			<xsl:if test="@widget">,widget:'<xsl:value-of select="@widget"/>'</xsl:if>
		});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:upload/gui:placeholder">
	<div class="hui_upload_placeholder">
		<span class="hui_upload_icon"><xsl:comment/></span>
		<xsl:if test="@title"><h2><xsl:value-of select="@title"/></h2></xsl:if>
		<xsl:if test="@text"><p><xsl:value-of select="@text"/></p></xsl:if>
	</div>
</xsl:template>


<!-- Rich text -->

<xsl:template match="gui:richtext">
	<div class="hui_richtext" id="{generate-id()}">
		<div class="hui_richtext_toolbar" id="{generate-id()}_toolbar"><div class="hui_richtext_inner_toolbar"><div class="hui_richtext_toolbar_content" id="{generate-id()}_toolbar_content"><xsl:comment/></div></div></div>
		<iframe id="{generate-id()}_iframe" style="width: 100%; height: {@heigth}px;" frameborder="0"/>		
		<script type="text/javascript">
			var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.RichText({element:'<xsl:value-of select="generate-id()"/>',name:'<xsl:value-of select="@name"/>'});
			<xsl:call-template name="gui:createobject"/>
		</script>
	</div>
</xsl:template>



<!-- Gallery -->

<xsl:template match="gui:gallery">
	<div class="hui_gallery" id="{generate-id()}">
		<xsl:if test="@padding"><xsl:attribute name="style">padding:<xsl:value-of select="@padding"/>px;</xsl:attribute></xsl:if>
		<div class="hui_gallery_progress"><xsl:comment/></div>
		<div class="hui_gallery_body">
			<xsl:comment/>
			<xsl:text>&#160;</xsl:text>
		</div>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Gallery({
			element:'<xsl:value-of select="generate-id()"/>',
			name:'<xsl:value-of select="@name"/>'
			<xsl:if test="@source">,source:<xsl:value-of select="@source"/></xsl:if>
		});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>



<!-- Calendar -->

<xsl:template match="gui:calendar">
	<div class="hui_calendar" id="{generate-id()}">
		<xsl:if test="@state and (not(//gui:gui/@state) or @state!=//gui:gui/@state)">
			<xsl:attribute name="style">display:none</xsl:attribute>
		</xsl:if>
	<div class="hui_calendar_bar">
		<xsl:comment/>
	</div>
	<table class="hui_calendar_weekview">
		<thead>
		<tr>
			<th class="day"><xsl:comment/></th>
			<th class="day"><xsl:comment/></th>
			<th class="day"><xsl:comment/></th>
			<th class="day"><xsl:comment/></th>
			<th class="day"><xsl:comment/></th>
			<th class="day"><xsl:comment/></th>
			<th class="day"><xsl:comment/></th>
		</tr>
		</thead>
		<tbody>
		<tr>
			<td><div class="hui_calendar_day"><xsl:comment/></div></td>
			<td><div class="hui_calendar_day"><xsl:comment/></div></td>
			<td><div class="hui_calendar_day"><xsl:comment/></div></td>
			<td><div class="hui_calendar_day"><xsl:comment/></div></td>
			<td><div class="hui_calendar_day"><xsl:comment/></div></td>
			<td><div class="hui_calendar_day"><xsl:comment/></div></td>
			<td><div class="hui_calendar_day"><xsl:comment/></div></td>
		</tr>
		</tbody>
	</table>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Calendar({
			element:'<xsl:value-of select="generate-id()"/>'
			,name:'<xsl:value-of select="@name"/>'
			,state:'<xsl:value-of select="@state"/>'
			<xsl:if test="@startHour">,startHour:<xsl:value-of select="@startHour"/></xsl:if>
			<xsl:if test="@endHour">,endHour:<xsl:value-of select="@endHour"/></xsl:if>
			<xsl:if test="@source">,source:<xsl:value-of select="@source"/></xsl:if>
		});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>



<!-- Graphviz -->

<xsl:template match="gui:graphviz">
	<div class="hui_graphviz" id="{generate-id()}">
		<div class="hui_graphviz_texts" style="position: relative;"><xsl:comment/></div>
		<canvas/>
	</div>
	<script type="text/javascript">
		hui.require('<xsl:value-of select="$context"/>/hui/ext/Graphviz.js',function() {
			var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Graphviz('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>');
			<xsl:call-template name="gui:createobject"/>
		});
	</script>
</xsl:template>

<!-- Picker -->

<xsl:template match="gui:picker">
	<div id="{generate-id()}">
		<xsl:attribute name="class">
			<xsl:text>hui_picker</xsl:text>
			<xsl:if test="@shadow='true'"><xsl:text> hui_picker_shadow</xsl:text></xsl:if>
		</xsl:attribute>
		<div class="hui_picker_top"><div><div></div></div></div>
		<div class="hui_picker_middle"><div class="hui_picker_middle">
			<xsl:if test="@title">
				<div class="hui_picker_title"><xsl:value-of select="@title"/></div>
			</xsl:if>
		<div class="hui_picker_container"><div class="hui_picker_content"><xsl:comment/></div></div>
		</div></div>
		<div class="hui_picker_bottom"><div><div></div></div></div>
	</div>
	<script type="text/javascript">
		(function() {
			var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Picker({
				element:'<xsl:value-of select="generate-id()"/>',
				name:'<xsl:value-of select="@name"/>'
				<xsl:if test="@item-height">,itemHeight:<xsl:value-of select="@item-height"/></xsl:if>
				<xsl:if test="@item-width">,itemWidth:<xsl:value-of select="@item-width"/></xsl:if>
			});
			<xsl:call-template name="gui:createobject"/>
			var items = [];
			<xsl:for-each select="gui:item">
				items.push({
					title:'<xsl:value-of select="@title"/>'
					,image:'<xsl:value-of select="@image"/>'
					,value:'<xsl:value-of select="@value"/>'
				});
			</xsl:for-each>
			<xsl:value-of select="generate-id()"/>_obj.setObjects(items);
		})();
	</script>
</xsl:template>

<xsl:template match="gui:articles">
	<div class="hui_articles" id="{generate-id()}"><xsl:comment/></div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Articles({
			element:'<xsl:value-of select="generate-id()"/>',
			name:'<xsl:value-of select="@name"/>'
			<xsl:if test="@source">,source:<xsl:value-of select="@source"/></xsl:if>
		});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="html:html">
	<xsl:copy-of select="child::*|child::text()"/>
</xsl:template>

<xsl:template match="gui:text">
	<div class="hui_text">
		<xsl:if test="@align">
			<xsl:attribute name="style">text-align:<xsl:value-of select="@align"/>;</xsl:attribute>
		</xsl:if>
		<xsl:apply-templates/>
	</div>
</xsl:template>

<xsl:template match="gui:link">
	<a href="javascript:void(0);" class="hui_link" id="{generate-id()}"><span><xsl:apply-templates/></span></a>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Link({
			element:'<xsl:value-of select="generate-id()"/>',
			name:'<xsl:value-of select="@name"/>'
		});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:text/gui:header | gui:text/gui:h">
	<h1><xsl:apply-templates/></h1>
</xsl:template>

<xsl:template match="gui:text/gui:p">
	<p><xsl:apply-templates/></p>
</xsl:template>

<xsl:template match="gui:segmented" name="gui:segmented">
	<span class="hui_segmented" id="{generate-id()}">
		<xsl:for-each select="gui:item">
			<a href="javascript:void(0)" rel="{@value}">
				<xsl:if test="@value=../@value">
					<xsl:attribute name="class">hui_segmented_selected</xsl:attribute>
				</xsl:if>
				<xsl:if test="@icon">
					<span class="hui_icon_16" style="background-image: url('{$context}/hui/icons/{@icon}16.png')"><xsl:comment/></span>
				</xsl:if>
				<xsl:if test="@title">
					<span class="hui_segmented_text"><xsl:value-of select="@title"/></span>
				</xsl:if>
			</a>
		</xsl:for-each>
	<xsl:comment/></span>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Segmented({
			element:'<xsl:value-of select="generate-id()"/>',
			name:'<xsl:value-of select="@name"/>'
			<xsl:if test="@value">,value:'<xsl:value-of select="@value"/>'</xsl:if>
			<xsl:if test="@allow-null='true'">,allowNull:true</xsl:if>
		});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

</xsl:stylesheet>