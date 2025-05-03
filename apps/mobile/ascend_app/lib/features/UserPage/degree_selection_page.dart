import 'package:flutter/material.dart';

class DegreeSelectionPage extends StatefulWidget {
  final void Function(String) onDegreeSelected;
  final String? selectedDegree;

  const DegreeSelectionPage({
    super.key,
    required this.onDegreeSelected,
    this.selectedDegree = "Ex: Bachelor's",
  });

  @override
  State<DegreeSelectionPage> createState() => _DegreeSelectionPageState();
}

class _DegreeSelectionPageState extends State<DegreeSelectionPage> {
  final TextEditingController _searchController = TextEditingController();
  final List<String> _degrees = [
    // High School / Pre-University
    "High School Diploma",
    "GED - General Educational Development",
    "International Baccalaureate (IB)",
    "GCSE - General Certificate of Secondary Education",
    "A-Levels",
    "O-Levels",

    // Associate Degrees
    "Associate's degree",
    "Associate of Arts - AA",
    "Associate of Science - AS",
    "Associate of Applied Science - AAS",
    "Associate of Fine Arts - AFA",
    "Associate of Engineering - AE",
    "Associate of Business Administration - ABA",

    // Bachelor's Degrees
    "Bachelor of Arts - BA",
    "Bachelor of Science - BS / BSc",
    "Bachelor of Business Administration - BBA",
    "Bachelor of Fine Arts - BFA",
    "Bachelor of Engineering - BEng",
    "Bachelor of Computer Science - BCS / BComp",
    "Bachelor of Applied Science - BASc",
    "Bachelor of Education - BEd",
    "Bachelor of Laws - LLB",
    "Bachelor of Architecture - BArch",
    "Bachelor of Design - BDes",
    "Bachelor of Commerce - BCom",
    "Bachelor of Technology - BTech",
    "Bachelor of Nursing - BN / BSN",
    "Bachelor of Medicine, Bachelor of Surgery - MBBS",

    // Master's Degrees
    "Master of Arts - MA",
    "Master of Science - MS / MSc",
    "Master of Business Administration - MBA",
    "Master of Fine Arts - MFA",
    "Master of Education - MEd",
    "Master of Public Administration - MPA",
    "Master of Social Work - MSW",
    "Master of Architecture - MArch",
    "Master of Laws - LLM",
    "Master of Computer Applications - MCA",
    "Master of Computer Science - MCS",
    "Master of Engineering - MEng",
    "Master of Design - MDes",
    "Master of Public Health - MPH",
    "Master of Finance - MFin",
    "Master of Philosophy - MPhil",

    // Doctoral Degrees
    "Doctor of Philosophy - PhD",
    "Doctor of Education - EdD",
    "Doctor of Medicine - MD",
    "Doctor of Dental Surgery - DDS",
    "Doctor of Psychology - PsyD",
    "Doctor of Business Administration - DBA",
    "Doctor of Public Health - DrPH",
    "Doctor of Engineering - DEng / EngD",
    "Doctor of Nursing Practice - DNP",
    "Juris Doctor - JD",
    "Doctor of Arts - DA",

    // Other / Non-degree Programs
    "Postgraduate Diploma - PGDip",
    "Professional Certificate",
    "Executive Education",
    "Certificate Program",
    "Vocational Training",
    "Trade School",
    "Diploma",
  ];
  List<String> _filteredDegrees = [];

  @override
  void initState() {
    super.initState();
    _filteredDegrees = _degrees; // Initialize with the full list
    _searchController.addListener(_filterDegrees);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _filterDegrees() {
    final query = _searchController.text.toLowerCase();
    setState(() {
      _filteredDegrees =
          _degrees
              .where((degree) => degree.toLowerCase().contains(query))
              .toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Degree"),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.close),
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),
      body: Column(
        children: [
          TextField(
            controller: _searchController,
            decoration: InputDecoration(
              labelText: widget.selectedDegree,
              labelStyle: const TextStyle(fontSize: 16, color: Colors.grey),

              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: BorderSide.none,
              ),
            ),
          ),

          Expanded(
            child: ListView.separated(
              itemCount: _filteredDegrees.length,
              separatorBuilder:
                  (context, index) =>
                      const Divider(height: 1, color: Colors.grey),
              itemBuilder: (context, index) {
                return ListTile(
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 3,
                  ),
                  title: Text(
                    _filteredDegrees[index],
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  onTap: () {
                    widget.onDegreeSelected(_filteredDegrees[index]);
                    Navigator.pop(context);
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
