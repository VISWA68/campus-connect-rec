import 'package:campusconnect/event_admin_pages/attendance_page.dart';
import 'package:campusconnect/event_admin_pages/manage_event.dart';
import 'package:campusconnect/event_admin_pages/registrations.dart';
import 'package:campusconnect/pages/login_page.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../event_admin_providers/user_provider.dart';

class AdminBasePage extends StatefulWidget {
  @override
  _AdminBasePageState createState() => _AdminBasePageState();
}

class _AdminBasePageState extends State<AdminBasePage> {
  int _selectedIndex = 0;

  final List<Widget> _pages = [
    RegistrationsPage(),
    AdminEventsPage(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.people),
            label: 'Registrations',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.check_circle),
            label: 'Attendance',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Theme.of(context).primaryColor,
        onTap: _onItemTapped,
      ),
    );
  }
}
