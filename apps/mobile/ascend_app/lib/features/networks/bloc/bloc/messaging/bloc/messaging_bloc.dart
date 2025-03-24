import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';

part 'messaging_event.dart';
part 'messaging_state.dart';

class MessagingBloc extends Bloc<MessagingEvent, MessagingState> {
  MessagingBloc() : super(MessagingInitial()) {
    on<MessagingEvent>((event, emit) {
      // TODO: implement event handler
    });
  }
}
