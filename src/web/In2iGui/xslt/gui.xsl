<?xml version="1.0"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:gui="uri:In2iGui"
    version="1.0"
    exclude-result-prefixes="gui"
    >
<xsl:include href="tabbox.xsl"/>
<xsl:include href="layout.xsl"/>
<xsl:include href="formula.xsl"/>
<xsl:include href="view.xsl"/>

<xsl:output encoding="UTF-8" ommit-xml-declarion="true" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>

<xsl:param name="context"/>
<xsl:param name="dev">true</xsl:param>

<xsl:template match="gui:gui">
<html>
<head>
<title><xsl:value-of select="@title"/></title>
<xsl:choose>
	<xsl:when test="$dev='true'">
		<link rel="stylesheet" href="{$context}/In2iGui/css/dev.css" type="text/css" media="screen" title="no title" charset="utf-8"/>
	</xsl:when>
	<xsl:otherwise>
		<link rel="stylesheet" href="{$context}/In2iGui/css/combined.css" type="text/css" media="screen" title="no title" charset="utf-8"/>
	</xsl:otherwise>
</xsl:choose>
<xsl:comment><![CDATA[[if lt IE 7]>
	<link rel="stylesheet" type="text/css" href="]]><xsl:value-of select="$context"/><![CDATA[/In2iGui/css/msie6.css"> </link>
<![endif]]]></xsl:comment>
<xsl:comment><![CDATA[[if gt IE 6]>
	<link rel="stylesheet" type="text/css" href="]]><xsl:value-of select="$context"/><![CDATA[/In2iGui/css/msie7.css"> </link>
<![endif]]]></xsl:comment>

<xsl:choose>
	<xsl:when test="$dev='true'">
		<script src="{$context}/In2iGui/lib/In2iScripts/In2iScripts.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/In2iGui/lib/In2iScripts/In2iAnimation.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/In2iGui/lib/In2iScripts/In2iInput.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/In2iGui/lib/json2.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/In2iGui/js/In2iGui.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/In2iGui/js/Window.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/In2iGui/js/Formula.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/In2iGui/js/List.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/In2iGui/js/Icons.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/In2iGui/js/Tabs.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/In2iGui/js/ViewStack.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/In2iGui/js/Tabbox.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/In2iGui/js/ObjectList.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/In2iGui/js/Alert.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/In2iGui/js/Button.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/In2iGui/js/Selection.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/In2iGui/js/Toolbar.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/In2iGui/js/ImagePicker.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}/In2iGui/js/BoundPanel.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
	</xsl:when>
	<xsl:otherwise>
		<script src="{$context}/In2iGui/js/minimized.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
	</xsl:otherwise>
</xsl:choose>
<xsl:for-each select="gui:controller">
<script src="{@source}" type="text/javascript" charset="utf-8"><xsl:comment/></script>
</xsl:for-each>
<script type="text/javascript">
In2iGui.context = '<xsl:value-of select="$context"/>';
<xsl:for-each select="gui:controller">
	In2iGui.get().addDelegate(<xsl:value-of select="@name"/>);
</xsl:for-each>
</script>
<xsl:call-template name="dwr-setup"/>
</head>
<body>
	<xsl:choose>
		<xsl:when test="@pad"><div style="padding: {@pad}px;" class="fullheight"><xsl:apply-templates/></div></xsl:when>
		<xsl:otherwise><xsl:apply-templates/></xsl:otherwise>
	</xsl:choose>
</body>
</html>
</xsl:template>

<xsl:template name="dwr-setup">
	<xsl:if test="gui:dwr">
		<script src="{$context}{gui:dwr/@base}engine.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$context}{gui:dwr/@base}util.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<xsl:for-each select="gui:dwr/gui:interface">
			<script src="{$context}{../@base}interface/{@name}.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		</xsl:for-each>
		<script type="text/javascript">
			dwr.engine.setErrorHandler(In2iGui.dwrErrorHandler);
		</script>
	</xsl:if>
</xsl:template>

<xsl:template name="gui:createobject">
	<xsl:if test="@name">
		var <xsl:value-of select="@name"/> = <xsl:value-of select="generate-id()"/>_obj;
	</xsl:if>
</xsl:template>

<xsl:template match="gui:dock">
<table style="height: 100%; width: 100%;">
<tr><td style="font-size: 0px;">
<iframe src="{@source}" style="height: 100%; width: 100%; border: none; font-size: 0px;" frameborder="0" onload="this.style.height=this.parentNode.clientHeight+'px';"/>
</td></tr>
<tr><td style="height: 70px; background: red;">

</td></tr>
</table>
</xsl:template>

<xsl:template match="gui:sidebar/gui:selection">
	<div class="in2igui_selection" id="{generate-id()}"><xsl:apply-templates/></div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Selection('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>',{source:'<xsl:value-of select="@source"/>',value:'<xsl:value-of select="@value"/>'});
		with (<xsl:value-of select="generate-id()"/>_obj) {
			<xsl:for-each select="gui:item">
				registerItem('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@title"/>','<xsl:value-of select="@icon"/>','<xsl:value-of select="@badge"/>','<xsl:value-of select="@value"/>');
			</xsl:for-each>
			<xsl:for-each select="gui:source">
				registerSource(<xsl:value-of select="generate-id()"/>_obj);
			</xsl:for-each>
		}
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:selection/gui:item">
	<div id="{generate-id()}">
		<xsl:attribute name="class">item<xsl:if test="@value=../@value"> selected</xsl:if></xsl:attribute>
		<xsl:if test="@icon">
		<div class="icon">
		<xsl:attribute name="style">background-image: url('<xsl:value-of select="$context"/>/In2iGui/icons/<xsl:value-of select="@icon"/>1.png');</xsl:attribute>
		<xsl:comment/>
		</div>
		</xsl:if>
		<xsl:if test="@badge"><span><xsl:value-of select="@badge"/></span></xsl:if>
		<xsl:value-of select="@title"/>
	</div>
</xsl:template>

<xsl:template match="gui:selection/gui:source">
	<div id="{generate-id()}">
		<xsl:comment/>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Selection.Source('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>',{url:'<xsl:value-of select="@url"/>'});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:selection/gui:title">
	<div class="title"><span><xsl:value-of select="."/></span></div>
</xsl:template>
	
<xsl:template match="gui:browser">
	<div class="browser" id="{generate-id()}">
		<div class="contents">
		<xsl:comment/>
		</div>
	</div>
	<script src="{$context}/In2iGui/js/Browser.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Browser('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@source"/>');
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>


<!--             Icons            -->

<xsl:template match="gui:icons">
	<div class="icons" id="{generate-id()}">
		ICONS
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Icons('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>',{source:'<xsl:value-of select="@source"/>',windowSize:'<xsl:value-of select="gui:window/@size"/>'});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<!--             List            -->

<xsl:template match="gui:list">
	<div class="in2igui_list" id="{generate-id()}">
		<div class="navigation"><span class="window_size"/><div class="selection window_number"><div><div class="window_number_body"><xsl:comment/></div></div></div><span class="count"/></div>
		<table cellspacing="0" cellpadding="0">
			<thead>
				<tr>
				<xsl:apply-templates select="gui:column"/>
				</tr>
			</thead>
			<tbody><xsl:comment/></tbody>
		</table>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.List('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>',{source:'<xsl:value-of select="@source"/>',windowSize:'<xsl:value-of select="gui:window/@size"/>'});
		with (<xsl:value-of select="generate-id()"/>_obj) {
			<xsl:for-each select="gui:column">
				registerColumn({key:'<xsl:value-of select="@key"/>',title:'<xsl:value-of select="@title"/>'});
			</xsl:for-each>
		}
		<xsl:call-template name="gui:createobject"/>
	</script>&#160;
</xsl:template>

<xsl:template match="gui:list/gui:window"></xsl:template>

<xsl:template match="gui:column">
	<th>
		<xsl:if test="@width='min'"><xsl:attribute name="style">width: 1%;</xsl:attribute></xsl:if>
		<xsl:value-of select="@title"/>
	</th>
</xsl:template>

<!--                  View stack                     -->



<xsl:template match="gui:viewstack">
	<xsl:for-each select="gui:content">
	<div class="viewstack_content" id="{generate-id()}">
		<xsl:if test="position()>1">
			<xsl:attribute name="style">display: none;</xsl:attribute>
		</xsl:if>
		<xsl:apply-templates/>
	</div>
	</xsl:for-each>
	
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.ViewStack('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>');
		with (<xsl:value-of select="generate-id()"/>_obj) {
		<xsl:for-each select="gui:content">
			registerContent('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>');
		</xsl:for-each>
		}
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:viewstack/gui:content">
</xsl:template>

<!--                             Tabs                             -->

<xsl:template match="gui:tabs">
<div class="tabs">
	<div class="tabs_bar">
		<xsl:for-each select="gui:tab">
		<span><xsl:value-of select="@title"/></span>
		</xsl:for-each>
	</div>
	<xsl:apply-templates select="gui:tab"/>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Tabs('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>');
		<xsl:call-template name="gui:createobject"/>
		with (<xsl:value-of select="generate-id()"/>_obj) {
		<xsl:for-each select="descendant::gui:tab">
			registerTab(<xsl:value-of select="generate-id()"/>_obj);
		</xsl:for-each>
		}
	</script>
</div>
</xsl:template>

<xsl:template match="gui:tabs/gui:tab">
	<div class="tab" id="{generate-id()}">
		<xsl:attribute name="style">
			<xsl:if test="position()>1">display: none;</xsl:if>
			<xsl:if test="@pad">padding: <xsl:value-of select="@pad"/>px;</xsl:if>
		</xsl:attribute>
		<xsl:apply-templates/>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Tabs.Tab('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>');
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<!--                  Toolbar                   -->


<xsl:template match="gui:toolbar" name="gui:toolbar">
	<div class="toolbar"><xsl:apply-templates /></div>
</xsl:template>

<xsl:template match="gui:toolbar/gui:icon">
	<div class="toolbar_icon" id="{generate-id()}">
		<div class="icon" style="background-image: url('{$context}In2iGui/icons/{@icon}2.png')">
			<xsl:if test="@overlay">
				<div class="overlay" style="background-image: url('{$context}In2iGui/icons/overlay/{@overlay}2.png')"><xsl:comment/></div>
			</xsl:if>
			<xsl:comment/>
		</div>
		<span><xsl:value-of select="@title"/></span>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Toolbar.Icon('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>');
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:toolbar/gui:search">
	<div class="toolbar_search" id="{generate-id()}">
		<input type="text"/>
		<span><xsl:value-of select="@title"/></span>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Toolbar.SearchField('<xsl:value-of select="generate-id()"/>');
		<xsl:if test="@object">
			var <xsl:value-of select="@object"/> = <xsl:value-of select="generate-id()"/>_obj;
		</xsl:if>
	</script>
</xsl:template>

<!-- Window -->

<xsl:template match="gui:window">
	<div class="in2igui_window" id="{generate-id()}"><div class="close">x</div>
		<div class="titlebar"><div class="titlebar"><div class="titlebar"><span><xsl:value-of select="@title"/></span></div></div></div>
		<div class="in2igui_window_content"><div class="in2igui_window_content"><div class="in2igui_window_content">
 			<xsl:attribute name="style"><xsl:if test="@width">width: <xsl:value-of select="@width"/>px;</xsl:if><xsl:if test="@pad">padding: <xsl:value-of select="@pad"/>px;</xsl:if></xsl:attribute>
			<xsl:apply-templates/>
		</div></div></div>
		<div class="in2igui_window_bottom"><div><div><xsl:comment/></div></div></div>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Window('<xsl:value-of select="generate-id()"/>');
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>


<!-- Upload -->

<xsl:template match="gui:upload">
	<div class="upload" id="{generate-id()}">
		<input type="file"/>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Upload('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>');
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

</xsl:stylesheet>
