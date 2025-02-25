import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../event_admin_providers/user_provider.dart';

class AttendancePage extends StatefulWidget {
  final String eventId;
  final String eventName;

  const AttendancePage(
      {Key? key, required this.eventId, required this.eventName})
      : super(key: key);

  @override
  _AttendancePageState createState() => _AttendancePageState();
}

class _AttendancePageState extends State<AttendancePage> {
  bool isScanning = false;
  bool isLoading = true;
  final MobileScannerController controller = MobileScannerController();

  @override
  void initState() {
    super.initState();
    fetchRegistrations();
  }

  Future<void> fetchRegistrations() async {
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    await userProvider.fetchRegisteredParticipants(widget.eventId);
    setState(() {
      isLoading = false;
    });
  }

Future<void> markAttendance(String email) async {
  try {
    final response = await http.post(
      Uri.parse('http://172.16.59.107:5000/mark_attendance'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'event_id': widget.eventId,
        'email': email,
      }),
    );

    if (response.statusCode == 200) {
      setState(() {
        for (var participant in Provider.of<UserProvider>(context, listen: false).registeredParticipants) {
          if (participant['email'] == email) {
            participant['attendance_marked'] = true;
          }
        }
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Attendance marked for $email')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to mark attendance')),
      );
    }
  } catch (e) {
    print('Error marking attendance: $e');
  }
}


void onQRCodeDetected(String? qrData) {
  if (qrData != null) {
    print('QR Code Scanned: $qrData'); // Debugging

    try {
      final data = json.decode(qrData);
      
      if (data.containsKey('event_id') && data.containsKey('email')) {
        print('Event ID: ${data['event_id']}, Email: ${data['email']}'); // Debugging

        if (data['event_id'] == widget.eventId) {
          markAttendance(data['email']);
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Invalid QR code for this event')),
          );
        }
      } else {
        print('Invalid QR data format'); // Debugging
      }
    } catch (e) {
      print('Error processing QR code: $e');
    }
  }
}


  @override
  Widget build(BuildContext context) {
    final userProvider = Provider.of<UserProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('Attendance - ${widget.eventName}'),
        actions: [
          IconButton(
            icon: Icon(isScanning ? Icons.stop : Icons.qr_code_scanner),
            onPressed: () {
              setState(() {
                isScanning = !isScanning;
              });
            },
          ),
        ],
      ),
      body: Column(
        children: [
          if (isScanning)
            SizedBox(
              height: 300,
              child: MobileScanner(
                controller: controller,
                onDetect: (capture) {
                  final List<Barcode> barcodes = capture.barcodes;
                  for (final barcode in barcodes) {
                    onQRCodeDetected(barcode.rawValue);
                  }
                },
              ),
            ),
          Expanded(
            child: isLoading
                ? const Center(child: CircularProgressIndicator())
                : ListView.builder(
                    padding: const EdgeInsets.all(16.0),
                    itemCount: userProvider.registeredParticipants.length,
                    itemBuilder: (context, index) {
                      final participant =
                          userProvider.registeredParticipants[index];
                      final bool isPresent =
                          participant['attendance_marked'] == true;

                      return Card(
                        margin: const EdgeInsets.symmetric(vertical: 8.0),
                        color: isPresent ? Colors.green[50] : Colors.red[50],
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundColor:
                                isPresent ? Colors.green : Colors.red,
                            child: Icon(
                              isPresent ? Icons.check : Icons.person,
                              color: Colors.white,
                            ),
                          ),
                          title: Text(participant['name']),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Email: ${participant['email']}'),
                              Text('Roll No: ${participant['roll_no']}'),
                              Text(
                                isPresent ? 'Present' : 'Not marked',
                                style: TextStyle(
                                  color: isPresent
                                      ? Colors.green[700]
                                      : Colors.red[700],
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                          isThreeLine: true,
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }
}
