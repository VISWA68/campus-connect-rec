import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../event_admin_providers/user_provider.dart';
import 'attendance_page.dart';

class AdminEventsPage extends StatefulWidget {
  @override
  _AdminEventsPageState createState() => _AdminEventsPageState();
}

class _AdminEventsPageState extends State<AdminEventsPage> {
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchEvents();
  }

  Future<void> fetchEvents() async {
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    await userProvider.refreshEvents();
    setState(() {
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final userProvider = Provider.of<UserProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text("Events")),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : userProvider.events.isEmpty
              ? const Center(child: Text("No events available"))
              : ListView.builder(
                  padding: const EdgeInsets.all(16.0),
                  itemCount: userProvider.events.length,
                  itemBuilder: (context, index) {
                    final event = userProvider.events[index];
                    return Card(
                      elevation: 4,
                      margin: const EdgeInsets.only(bottom: 16),
                      child: ListTile(
                        title: Text(
                          event['event_name'],
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        subtitle: Text(event['description']),
                        trailing: const Icon(Icons.arrow_forward_ios),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => AttendancePage(
                                eventId: event['event_id'],
                                eventName: event['event_name'],
                              ),
                            ),
                          );
                        },
                      ),
                    );
                  },
                ),
    );
  }
}
