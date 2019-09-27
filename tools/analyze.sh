#!/usr/bin/env ruby
require 'pathname'
require 'json'
require 'rexml/document'


class Component
  attr_accessor :name, :modern, :sass_path, :css_path, :html_example_path, :xml_example_path, :js_path
end

class Inspector

  def inspect(hui_path)

    components = list_dir hui_path
    check_graphics hui_path
    check_icons hui_path
    components.each { |component|
      puts component.name + (component.modern ? "+" : "")
      puts "  " + (component.sass_path ? component.sass_path.to_s : "none")
    }
    json = JSON.pretty_generate(components.map {|component|
      obj = {name: component.name}
      if component.sass_path
        obj[:sass] = component.sass_path.basename.to_s
      end
      if component.css_path
        obj[:css] = component.css_path.basename.to_s
      end
      if component.html_example_path
        obj[:htmlSample] = component.html_example_path.basename.to_s
      end
      if component.xml_example_path
        obj[:xmlSample] = component.xml_example_path.basename.to_s
      end
      obj
    })
    File.write(hui_path.join("info/components.json"), json)
  end

  def list_dir directory
    js_dir = directory.join("js")
    components = []
    js_dir.children.select{|item| !File.directory?(item)}.sort_by!{|obj| obj.basename.to_s.downcase}.each { |child|
      data = File.read(child)
      name = child.basename.to_s[0..-4]
      if /^[A-Z]+/m.match(name) != nil
        component = Component.new
        component.name = name
        component.modern = data.match?(/hui\.ui\.Component/)
        sass_path = directory.join("scss/" + name.downcase + ".scss")
        component.sass_path = sass_path if sass_path.exist?
        css_path = directory.join("css/" + name.downcase + ".css")
        component.css_path = css_path if css_path.exist?
        html_test_path = directory.join("test/html/" + name.downcase + ".html")
        component.html_example_path = html_test_path if html_test_path.exist?
        xml_test_path = directory.join("test/xml/" + name.downcase + ".xml")
        component.xml_example_path = xml_test_path if xml_test_path.exist?
        js_path = directory.join("js/" + name + ".js")
        component.js_path = js_path if js_path.exist?
        components.push component
      end
    }
    return components
  end

  def check_graphics directory
    all_css = File.read(directory.join("bin/joined.css"))
    gfx_dir = directory.join("gfx")
    gfx_dir.children.select{|item| !File.directory?(item)}.sort_by!{|obj| obj.basename.to_s.downcase}.each { |file|
      if all_css.index(file.basename.to_s) == nil 
        puts "Graphic not found: #{file.basename}"
      end
    }
  end

  def check_icons directory
    dir = directory.join("icons")
    dir.children.select{|item| File.directory?(item)}.each do |group|
      names = group.children.sort_by!{|obj| obj.basename.to_s.downcase}.map{|file| /^[a-z_]+/.match(file.basename.to_s).to_s }.select{|name| name.length > 0}.uniq.each do |name|
        puts "Icon: #{group.basename.to_s}/#{name}"
        ch = [
          group.join("#{name}16.svg"),
          group.join("#{name}16.png"),
          group.join("#{name}16x2.png")
        ]
        if group.basename.to_s != 'monochrome'
          ch += [
            group.join("#{name}32.svg"),
            group.join("#{name}32.png"),
            group.join("#{name}32x2.png")
          ]
        end
        ch.each do |x|
          unless x.exist?
            puts "Missing icon: #{x}"
          end
        end
      end
    end
  end

  def check_css dir
    css_dir = dir.join("css")
    scss_dir = dir.join("scss")
    css_dir.children.sort.each do |file|
      scss_file = "#{file.basename.to_s.split('.').first}.scss"
      found = scss_dir.join(scss_file).exist?
      puts file.basename if !found
    end
  end
end

file_path = Pathname.new($0).realpath()

Inspector.new.inspect(file_path.parent.dirname)

Inspector.new.check_css(file_path.parent.dirname)