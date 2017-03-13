import re

def convert(filename):
	fh = open(filename, 'r')
	lines = fh.readlines()
	output = open(filename + '-dropdown', 'w')

	for line in lines:
		if 'name' in line:
			match_index = line.find('name=')
			match = line[match_index + 6:]
			name = match[:match.find("\"")]
			output.write('<option value=\"' + name + '\">' + name + '</option>\n')